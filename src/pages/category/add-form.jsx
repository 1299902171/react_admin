import React, {Component} from 'react';
import {Form, Select, Input} from "antd";

const Item = Form.Item
const Option = Select.Option

class AddForm extends Component {
    render() {
        const {getFieldDecorator} = this.props.form
        return (
            <Form>
                <Item>
                    {
                        getFieldDecorator('parentId', {
                            initialValue: '0'
                        })(
                            <Select>
                                <Option value='0'>First-class Classification</Option>
                                <Option value='1'>Second-class Classification</Option>
                                <Option value='2'>Third-class Classification</Option>
                            </Select>
                        )
                    }
                </Item>
                <Item>
                    {
                        getFieldDecorator('categoryName', {
                            initialValue: ''
                        })(
                            <Input placeholder='Please Input Classification Name'></Input>
                        )
                    }
                </Item>
            </Form>
        );
    }
}

export default Form.create()(AddForm);
