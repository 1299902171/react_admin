import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {Form, Select, Input} from "antd";

const Item = Form.Item
const Option = Select.Option

class AddForm extends Component {
    static propTypes = {
        setForm: PropTypes.func.isRequired,
        categories: PropTypes.array.isRequired,
        parentId: PropTypes.string.isRequired,
    }

    componentWillMount() {
        this.props.setForm(this.props.form)
    }

    render() {
        const {categories, parentId} = this.props
        const {getFieldDecorator} = this.props.form
        return (
            <Form>
                <Item>
                    {
                        getFieldDecorator('parentId', {
                            initialValue: parentId,
                            rules:[
                                {required:true,message:'Classification is Required'}
                            ]
                        })(
                            <Select>
                                <Option value='0'>First-class Classification</Option>
                                {
                                    categories.map(c => <Option value={c._id}>{c.name}</Option>)
                                }
                            </Select>
                        )
                    }
                </Item>
                <Item>
                    {
                        getFieldDecorator('categoryName', {
                            initialValue: ''
                        })(
                            <Input placeholder='Please Input New Classification Name'></Input>
                        )
                    }
                </Item>
            </Form>
        );
    }
}

export default Form.create()(AddForm);
