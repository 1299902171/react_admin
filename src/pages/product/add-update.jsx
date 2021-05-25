import React, {Component} from 'react';
import {Card, Form, Input, Cascader, Button, Icon} from "antd";
import LinkButton from "../../components/link-button";
import {reqCategories} from "../../api";
import PicturesWall from "./pictures-wall";

const {Item} = Form
const {TextArea} = Input

class ProductAddUpdate extends Component {
    state = {
        options: [],
    }
    constructor(props) {
        super(props);
        this.pw=React.createRef()
    }

    initOptions = async (categories) => {
        const options = categories.map(c => ({
            value: c._id,
            label: c.name,
            isLeaf: false
        }))
        const {isUpdate, product} = this
        const {pCategoryId} = product
        if (isUpdate && pCategoryId !== '0') {
            const subCategories = await this.getCategories(pCategoryId)
            const childOptions = subCategories.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true
            }))
            const targetOptions = options.find(option => option.value === pCategoryId)
            targetOptions.children = childOptions
        }
        this.setState({
            options
        })
    }

    getCategories = async (parentId) => {
        const result = await reqCategories(parentId)
        if (result.status === 0) {
            const categories = result.data
            if (parentId === '0') {
                this.initOptions(categories)
            } else {
                return categories
            }
        }
    }

    submit = () => {
        this.props.form.validateFields((error, values) => {
            if (!error) {
                this.pw.current.getImgs()
            } else {

            }
        })
    }

    validatePrice = (rule, value, callback) => {
        if (value * 1 > 0) {
            callback()
        } else {
            callback('price must be bigger than 1')
        }
    }

    loadData = async selectedOptions => {
        const targetOption = selectedOptions[0]
        targetOption.loading = true
        const subCategories = await this.getCategories(targetOption.value)
        targetOption.loading = false
        if (subCategories && subCategories.length > 0) {
            const childOptions = subCategories.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: false
            }))
            targetOption.children = childOptions
        } else {
            targetOption.isLeaf = true
        }
        this.setState({
            options: [...this.state.options]
        })
    }

    componentDidMount() {
        this.getCategories('0')
    }

    componentWillMount() {
        const product = this.props.location.state
        this.isUpdate = !!product
        this.product = product || {}
    }

    render() {
        const {isUpdate, product} = this
        const {pCategoryId, categoryId,imgs} = product
        const categoryIds = []
        if (isUpdate) {
            if (pCategoryId === '0') {
                categoryIds.push(pCategoryId)
            } else {
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
            }
        }
        const formItemLayout = {
            labelCol: {span: 3},
            wrapperCol: {span: 8}
        }
        const title = (
            <span>
                <LinkButton onClick={() => this.props.history.goBack()}>
                    <Icon type='arrow-left' style={{fontSize: 20}}/>
                </LinkButton>
                <span>{isUpdate ? 'Modify Product' : 'Add Product'}</span>
            </span>
        )

        const {getFieldDecorator} = this.props.form

        return (
            <Card title={title}>
                <Form {...formItemLayout}>
                    <Item label='Product Name'>
                        {
                            getFieldDecorator('name', {
                                initialValue: product.name,
                                rules: [
                                    {required: true, message: 'Product name is required!'}
                                ]
                            })(<Input/>)
                        }
                    </Item>
                    <Item label='Product Description'>
                        {
                            getFieldDecorator('desc', {
                                initialValue: product.desc,
                                rules: [
                                    {required: true, message: 'Product description is required!'}
                                ]
                            })(<TextArea autosize={{minRows: 2, maxRows: 8}}/>)
                        }
                    </Item>
                    <Item label='Product Price'>
                        {
                            getFieldDecorator('price', {
                                initialValue: product.price,
                                rules: [
                                    {required: true, message: 'Product price is required!'},
                                    {validator: this.validatePrice}
                                ]
                            })(<Input type='number' addonAfter='RMB'/>)
                        }
                    </Item>
                    <Item label='Product Classification'>
                        {
                            getFieldDecorator('categoryIds', {
                                initialValue: categoryIds,
                                rules: [
                                    {required: true, message: 'Product classification is required!'},
                                ]
                            })(<Cascader
                                options={this.state.options}
                                loadData={this.loadData}
                            />)
                        }

                    </Item>
                    <Item label='Product Picture'>
                        <PicturesWall ref={this.pw} imgs={imgs}/>
                    </Item>
                    <Item label='Product Detail'>

                    </Item>
                    <Item>
                        <Button type='primary' onClick={this.submit}>Submit</Button>
                    </Item>
                </Form>
            </Card>
        );
    }
}

export default Form.create()(ProductAddUpdate);
