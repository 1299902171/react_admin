import React, {Component} from 'react';
import {Card, Button, Table, Modal, message} from "antd";
import {PAGE_SIZE} from "../../utils/constants";
import {reqAddRole, reqRoles, reqUpdateRole} from "../../api";
import AddForm from "./add-form";
import AuthForm from "./auth-form";
import {formateDate} from "../../utils/dateUtils";
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";

class Role extends Component {
    state = {
        roles: [],
        role: {},
        isShowAdd: false,
        isShowAuth: false,
    }

    constructor(props) {
        super(props);
        this.auth = React.createRef()
    }

    updateRole = async () => {
        this.setState({
            isShowAuth: false
        })
        const role = this.state.role
        const menus = this.auth.current.getMenus()
        role.menus = menus
        role.auth_time = Date.now()
        role.auth_name = memoryUtils.user.username
        const result = await reqUpdateRole(role)
        if (result.status === 0) {
            if (role._id === memoryUtils.user.role_id) {
                memoryUtils.user = {}
                storageUtils.removeUser()
                this.props.history.replace('/login')
                message.success('当前用户角色权限成功！重新登录！')
            } else {
                message.success('设置角色权限成功')
                this.setState({
                    roles: [...this.state.roles]
                })
            }
        }
    }
    addRole = () => {
        this.form.validateFields(async (errors, values) => {
            if (!errors) {
                this.setState({
                    isShowAdd: false
                })
                const {roleName} = values
                this.form.resetFields()
                const result = await reqAddRole()
                if (result.status === 0) {
                    message.success('Success!')
                    const role = result.data
                    this.setState(state => ({
                        roles: [...state.roles, role]
                    }))
                } else {
                    message.error(result.msg)
                }
            }
        })

    }
    onRow = (role) => {
        return {
            onClick: event => {
                this.setState({
                    role
                })
            }
        }
    }
    getRoles = async () => {
        const result = await reqRoles()
        if (result.status === 0) {
            const roles = result.data
            this.setState({
                roles
            })
        }
    }
    initColumn = () => {
        this.columns = [
            {
                title: 'Role Name',
                dataIndex: 'name'
            },
            {
                title: 'Creation Time',
                dataIndex: 'create_time',
                render: (create_time) => formateDate(create_time)
            },
            {
                title: 'Authority Time',
                dataIndex: 'auth_time',
                render: (auth_time) => formateDate(auth_time)
            },
            {
                title: 'Authority Person',
                dataIndex: 'auth_name'
            },
        ]
    }

    componentWillMount() {
        this.initColumn()
    }

    componentDidMount() {
        this.getRoles()
    }

    render() {
        const {roles, role, isShowAdd, isShowAuth} = this.state
        const title = (
            <span>
                <Button type='primary' onClick={() => this.setState({isShowAdd: true})}>Create Role</Button>&nbsp;&nbsp;
                <Button type='primary' disabled={!role._id} onClick={() => this.setState({isShowAuth: true})}>Set Role Authority</Button>
            </span>
        )
        return (
            <Card title={title}>
                <Table
                    bordered
                    rowKey='_id'
                    dataSource={roles}
                    columns={this.columns}
                    pagination={{defaultPageSize: PAGE_SIZE, showQuickJumper: true}}
                    rowSelection={{
                        type: 'radio', selectedRowKeys: [role._id], onSelect: (role) => {
                            this.setState({
                                role
                            })
                        }
                    }}
                    onRow={this.onRow}
                />
                <Modal
                    title='Add Role'
                    visible={isShowAdd}
                    onOk={this.addRole}
                    onCancel={() => {
                        this.setState({isShowAdd: false})
                        this.form.resetFields()
                    }}
                >
                    <AddForm
                        setForm={(form) => this.form = form}
                    />
                </Modal>
                <Modal
                    title='Set Authority'
                    visible={isShowAuth}
                    onOk={this.updateRole}
                    onCancel={() => {
                        this.setState({isShowAuth: false})
                    }}
                >
                    <AuthForm role={role} ref={this.auth}/>
                </Modal>
            </Card>
        );
    }
}

export default Role;
