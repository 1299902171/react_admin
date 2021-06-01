import React, {Component} from 'react';
import {Card, Button, Table, Modal, message} from "antd";
import AddForm from "../category/add-form";
import {formateDate} from "../../utils/dateUtils";
import LinkButton from "../../components/link-button";
import {reqDeleteUser, reqUsers} from "../../api";
import {PAGE_SIZE} from "../../utils/constants";

class User extends Component {
    state = {
        users: [],
        roles: [],
        isShow: false,
    }
    initColumns = () => {
        this.columns = [
            {
                title: 'User Name',
                dataIndex: 'username'
            },
            {
                title: 'Email',
                dataIndex: 'email'
            },
            {
                title: 'Tel',
                dataIndex: 'tel'
            },
            {
                title: 'Reg Time',
                dataIndex: 'create_time',
                render: formateDate
            },
            {
                title: 'Role',
                dataIndex: 'role_id',
                render: (role_id) => this.roleNames[role_id]
            },
            {
                title: 'Operation',
                render: (user) => (
                    <span>
                        <LinkButton>Modify</LinkButton>
                        <LinkButton onClick={() => this.deleteUser(user)}>Delete</LinkButton>
                    </span>
                )
            },
        ]
    }
    deleteUser = (user) => {
        Modal.confirm({
            title: `Are You Sure to Delete User ${user.username}?`,
            onOk: async () => {
                const result = await reqDeleteUser(user._id)
                if (result.status === 0) {
                    message.success('Success!')
                    this.getUsers()
                }
            }
        })
    }
    addOrUpdateUser = () => {

    }
    initRoleNames = (roles) => {
        const roleNames = roles.reduce((pre, role) => {
            pre[role._id] = role.name
            return pre
        }, {})
        // 保存
        this.roleNames = roleNames
    }
    getUsers = async () => {
        const result = await reqUsers()
        if (result.status === 0) {
            const {users, roles} = result.data
            this.initRoleNames(roles)
            this.setState({
                users,
                roles
            })
        }
    }

    componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getUsers()
    }

    render() {
        const {users, isShow} = this.state
        const title = <Button type='primary'>Create User</Button>
        return (
            <Card title={title}>
                <Table
                    dataSource={users}
                    columns={this.columns}
                    bordered={true}
                    rowKey='_id'
                    pagination={{defaultPageSize: PAGE_SIZE, showQuickJumper: true}}></Table>
                <Modal
                    title='Add User'
                    visible={isShow}
                    onOk={this.addOrUpdateUser}
                    onCancel={() => this.setState({isShow: false})}
                >
                    <div>

                    </div>
                </Modal>

            </Card>
        );
    }
}

export default User;
