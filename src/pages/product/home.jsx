import React, {Component} from 'react';
import {Card, Select, Input, Button, Icon, Table} from "antd";
import LinkButton from "../../components/link-button";

const Option = Select.Option

class ProductHome extends Component {
    state = {
        products: [],
    }
    initColumns = () => {
        this.columns = [
            {
                title: 'Product Name',
                dataIndex: 'name'
            },
            {
                title: 'Description of Product',
                dataIndex: 'desc'
            },
            {
                title: 'Price',
                dataIndex: 'price',
                render: (price) => '￥' + price
            },
            {
                title:'Status',
                width:100,
                dataIndex:'status',
                render: (status)=>{
                    return(
                        <span>
                            <Button type='primary'>Take Off</Button>
                            <span>On Sale</span>
                        </span>
                    )
                }
            },
            {
                title:'Operations',
                width:100,
                render: (product)=>{
                    return(
                        <span>
                            <LinkButton>Details</LinkButton>
                            <LinkButton>Modify</LinkButton>
                        </span>
                    )
                }
            }
        ]
    }

    componentWillMount() {
        this.initColumns()
    }

    render() {
        const {products} = this.state
        const title = (
            <span>
                <Select value='1' style={{width: 200}}>
                    <Option value='1'>Search by Name</Option>
                    <Option value='2'>Search by Description</Option>
                </Select>
                <Input placeholder='Key Word' style={{width: 150, margin: '0 15px'}}/>
                <Button type='primary'>Search</Button>
            </span>
        )
        const extra = (
            <Button type='primary'>
                <Icon type='plus'/>
                Add Product
            </Button>
        )
        return (
            <Card title={title} extra={extra}>
                <Table bordered rowKey='_id' dataSource={products} columns={this.columns}/>
            </Card>
        );
    }
}

export default ProductHome;
