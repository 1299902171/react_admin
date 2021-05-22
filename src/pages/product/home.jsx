import React, {Component} from 'react';
import {Card, Select, Input, Button, Icon, Table} from "antd";
import LinkButton from "../../components/link-button";
import {reqProducts, reqSearchProducts} from "../../api";
import {PAGE_SIZE} from "../../utils/constants";

const Option = Select.Option

class ProductHome extends Component {
    state = {
        total: 0,
        products: [],
        loading: false,
        searchName: '',
        searchType: 'productName',
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
                title: 'Status',
                width: 100,
                dataIndex: 'status',
                render: (status) => {
                    return (
                        <span>
                            <Button type='primary'>Take Off</Button>
                            <span>On Sale</span>
                        </span>
                    )
                }
            },
            {
                title: 'Operations',
                width: 100,
                render: (product) => {
                    return (
                        <span>
                            <LinkButton onClick={()=>this.props.history.push('/product/detail',{product})}>Details</LinkButton>
                            <LinkButton>Modify</LinkButton>
                        </span>
                    )
                }
            }
        ]
    }
    getProducts = async (pageNum) => {
        this.pageNum = pageNum
        this.setState({loading: true})
        const {searchName, searchType} = this.state
        let result
        if (searchName) {
            result = await reqSearchProducts({pageNum, PageSize: PAGE_SIZE, searchName, searchType})
        } else {
            result = await reqProducts(pageNum, PAGE_SIZE)
        }
        this.setState({loading: false})
        if (result.status === 0) {
            const {total, list} = result.data
            this.setState({
                total,
                products: list
            })
        }
    }

    componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getProducts(1)
    }

    render() {
        const {products, total, loading, searchName, searchType} = this.state
        const title = (
            <span>
                <Select
                    value={searchType}
                    style={{width: 200}}
                    onChange={value => this.setState({searchType: value})}
                >
                    <Option value='productName'>Search by Name</Option>
                    <Option value='productDesc'>Search by Description</Option>
                </Select>
                <Input
                    placeholder='Key Word'
                    style={{width: 150, margin: '0 15px'}}
                    value={searchName}
                    onChange={event => this.setState({searchName: event.target.value})}
                />
                <Button type='primary' onClick={() => this.getProducts(1)}>Search</Button>
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
                <Table bordered
                       rowKey='_id'
                       loading={loading}
                       dataSource={products}
                       columns={this.columns}
                       pagination={{
                           current:this.pageNum,
                           total,
                           defaultPageSize: PAGE_SIZE,
                           showQuickJumper: true,
                           onChange: this.getProducts
                       }}
                />
            </Card>
        );
    }
}

export default ProductHome;
