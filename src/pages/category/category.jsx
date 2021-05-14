import React, {Component} from 'react';
import {Card, Table, Button, Icon, message} from "antd";
import LinkButton from "../../components/link-button";
import {reqCategories} from "../../api";

class Category extends Component {
    state = {
        categories: []
    }
    initColumns = () => {
        this.columns = [
            {
                title: 'category name',
                dataIndex: 'name',
            },
            {
                title: 'operation',
                width: 300,
                render: () => (
                    <span>
                        <LinkButton>Alter classification</LinkButton>
                        <LinkButton>View sub-categories</LinkButton>
                    </span>
                )
            }
        ]
    }
    getCategories = async () => {
        const result = await reqCategories('0')
        if (result.status === 0) {
            const categories = result.data
            this.setState({
                categories
            })
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
        const {categories} = this.state
        const title = 'First-level classification list'
        const extra = (
            <Button type='primary'>
                <Icon type='plus'/>
                Add
            </Button>
        )

        return (
            <Card title={title} extra={extra}>
                <Table
                    dataSource={categories}
                    columns={this.columns}
                    bordered={true}
                    rowKey='_id'></Table>
            </Card>
        );
    }
}

export default Category;
