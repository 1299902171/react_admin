import React, {Component} from 'react';
import {Card, Form, Input, Cascader, Button, Icon, message} from "antd";
import LinkButton from "../../components/link-button";
import {reqCategories, reqAddOrUpdateProduct} from "../../api";
import PicturesWall from "./pictures-wall";
import RichTextEditor from "./rich-text-editor";

const {Item} = Form
const {TextArea} = Input

class ProductAddUpdate extends Component {
    state = {
        options: [],
    }

    constructor(props) {
        super(props);
        this.pw = React.createRef()
        this.editor = React.createRef()
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
        this.props.form.validateFields(async (error, values) => {
            if (!error) {
                const {name, desc, price} = values
                // let pCategoryId, categoryId
                // if (categoryIds.length === 1) {
                //     pCategoryId = '0'
                //     categoryId = categoryIds[0]
                // } else {
                //     pCategoryId = categoryIds[0]
                //     categoryId = categoryIds[1]
                // }
                const imgs = this.pw.current.getImgs()
                const detail = this.editor.current.getDetail()
                const product = {name, desc, price, imgs, detail}
                if (this.isUpdate) {
                    product._id = this.product._id
                }
                const result = await reqAddOrUpdateProduct(product)
                if (result.status === 0) {
                    message.success(`${this.isUpdate ? 'Update ' : 'Add '}Successfully!`)
                    this.props.history.goBack()
                } else {
                    message.error(`${this.isUpdate ? 'Update ' : 'Add '}Failed!`)
                }
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
        const {pCategoryId, categoryId, imgs, detail} = product
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
                    <Item label='Product Detail' labelCol={{span: 2}} wrapperCol={{span: 20}}>
                        <RichTextEditor ref={this.editor} detail={detail}/>
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
