import React, {Component} from 'react';
import {Card, Form, Input, Cascader, Button, Icon} from "antd";
import LinkButton from "../../components/link-button";
import {reqCategories} from "../../api";

const {Item} = Form
const {TextArea} = Input

class ProductAddUpdate extends Component {
    state = {
        options: [],
    }

    initOptions = (categories) => {
        const options = categories.map(c => ({
            value: c._id,
            label: c.name,
            isLeaf: false
        }))
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

    render() {
        const formItemLayout = {
            labelCol: {span: 3},
            wrapperCol: {span: 8}
        }
        const title = (
            <span>
                <LinkButton>
                    <Icon type='arrow-left' style={{fontSize: 20}}/>
                </LinkButton>
                <span>Add Product</span>
            </span>
        )

        const {getFieldDecorator} = this.props.form

        return (
            <Card title={title}>
                <Form {...formItemLayout}>
                    <Item label='Product Name'>
                        {
                            getFieldDecorator('name', {
                                initialValue: '',
                                rules: [
                                    {required: true, message: 'Product name is required!'}
                                ]
                            })(<Input/>)
                        }
                    </Item>
                    <Item label='Product Description'>
                        {
                            getFieldDecorator('desc', {
                                initialValue: '',
                                rules: [
                                    {required: true, message: 'Product description is required!'}
                                ]
                            })(<TextArea autosize={{minRows: 2, maxRows: 8}}/>)
                        }
                    </Item>
                    <Item label='Product Price'>
                        {
                            getFieldDecorator('price', {
                                initialValue: '',
                                rules: [
                                    {required: true, message: 'Product price is required!'},
                                    {validator: this.validatePrice}
                                ]
                            })(<Input type='number' addonAfter='RMB'/>)
                        }
                    </Item>
                    <Item label='Product Classification'>
                        <Cascader
                            options={this.state.options}
                            loadData={this.loadData}
                        />
                    </Item>
                    <Item label='Product Picture'>

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
