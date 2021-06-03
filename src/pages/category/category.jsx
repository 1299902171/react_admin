import React, {Component} from 'react';
import {Card, Table, Button, Icon, message, Modal} from "antd";
import LinkButton from "../../components/link-button";
import {reqCategories, reqUpdateCategories, reqAddCategories} from "../../api";
import AddForm from "./add-form";
import UpdateForm from "./update-form";

class Category extends Component {
    state = {
        loading: false,
        categories: [],
        parentId: '0',
        parentName: '',
        subCategories: [],
        showStatus: 0,
    }
    handleCancel = () => {
        this.setState({
            showStatus: 0
        })
    }
    showAdd = () => {
        this.setState({
            showStatus: 1
        })
    }
    addCategory = () => {
        this.form.validateFields(async (err,values) => {
            if (!err) {
                this.setState({
                    showStatus: 0
                })
                const {parentId, categoryName} = values
                this.form.resetFields()
                const result = await reqAddCategories(categoryName, parentId)
                if (result.status === 0) {
                    if (parentId === this.state.parentId) {
                        this.getCategories()
                    } else if (parentId === '0') {
                        this.getCategories('0')
                    }
                }
            }
        })
    }
    showUpdate = (category) => {
        this.category = category
        this.setState({
            showStatus: 2
        })
    }
    updateCategory =  () => {
        this.form.validateFields(async (err,values) => {
            if(!err){
                this.setState({
                    showStatus: 0
                })
                const categoryId = this.category._id
                const {categoryName} = values
                this.form.resetFields()
                const result = await reqUpdateCategories({categoryId, categoryName})
                if (result.status === 0) {
                    this.getCategories()
                }
                this.getCategories()
            }
        })

    }
    initColumns = () => {
        this.columns = [
            {
                title: 'category name',
                dataIndex: 'name',
            },
            {
                title: 'operation',
                width: 500,
                render: (category) => (
                    <span>
                        <LinkButton onClick={() => this.showUpdate(category)}>Alter classification</LinkButton>
                        {this.state.parentId === '0' ? <LinkButton onClick={() => {
                            this.showSubCategories(category)
                        }}>View sub-categories</LinkButton> : null}
                    </span>
                )
            }
        ]
    }
    showCategory = () => {
        this.setState({
            parentId: '0',
            parentName: '',
            subCategories: []
        })
    }
    showSubCategories = (category) => {
        this.setState({
            parentId: category._id,
            parentName: category.name
        }, () => {
            // console.log(this.state.parentId)
            this.getCategories()
        })

    }
    getCategories = async (parentId) => {
        this.setState({loading: true})
        // const {parentId} = this.state
        parentId = parentId || this.state.parentId
        const result = await reqCategories('0')
        this.setState({loading: false})
        if (result.status === 0) {
            const categories = result.data
            if (parentId === '0') {
                this.setState({
                    categories: categories
                })
            } else {
                this.setState({
                    subCategories: categories
                })
            }
        } else {
            message.error('Failed to get classification list')
        }
    }

    componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getCategories()
    }

    render() {
        const {categories, loading, subCategories, parentId, parentName, showStatus} = this.state
        const category = this.category || {}
        const title = parentId === '0' ? 'First-level classification list' : (
            <span>
                <LinkButton onClick={this.showCategory}>First-level classification list</LinkButton>
                <Icon type='arrow-right' style={{marginRight: 7}}></Icon>
                <span>{parentName}</span>
            </span>
        )
        const extra = (
            <Button type='primary' onClick={this.showAdd}>
                <Icon type='plus'/>
                Add
            </Button>
        )

        return (
            <Card title={title} extra={extra}>
                <Table
                    dataSource={parentId === '0' ? categories : subCategories}
                    columns={this.columns}
                    bordered={true}
                    rowKey='_id'
                    loading={loading}
                    pagination={{defaultPageSize: 8, showQuickJumper: true}}></Table>
                <Modal
                    title='Add Classification'
                    visible={showStatus === 1}
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}
                >
                    <AddForm
                        categories={categories}
                        parentId={parentId}
                        setForm={(form => {
                            this.form = form
                        })}
                    />
                </Modal>
                <Modal
                    title='Update Classification'
                    visible={showStatus === 2}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}
                >
                    <UpdateForm
                        categoryName={category.name}
                        setForm={(form => {
                            this.form = form
                        })}
                    />
                </Modal>
            </Card>
        );
    }
}

export default Category;
