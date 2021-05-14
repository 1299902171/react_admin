import React, {Component} from 'react'
import {
    Form,
    Icon,
    Input,
    Button,
    message,
} from 'antd'
import './login.less'
import logo from './images/logo.png'
import {reqLogin} from '../../api'
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
import {Redirect} from "react-router-dom";

const Item = Form.Item

class Login extends Component {

    handleSubmit = (event) => {
        event.preventDefault()
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                const {username, password} = values
                try {
                    const result = await reqLogin(username, password)
                    if (result.status === 0) {
                        message.success('Login successful!')
                        const user = result.data
                        memoryUtils.user = user
                        storageUtils.saveUser(user)
                        this.props.history.replace('/')
                    } else {
                        message.error(result.msg)
                    }
                } catch (error) {

                }
            } else {

            }
        })
    }

    validatePassword = (rule, value, callback) => {
        if (!value) {
            callback('Password is required')
        } else if (value.length < 4) {
            callback('The password length cannot be less than 4 digits')
        } else if (value.length > 12) {
            callback('The password length cannot be greater than 12 digits')
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            callback('Password must consist of English letters, numbers or underscores')
        } else {
            callback()
        }
    }

    render() {
        const user = memoryUtils.user
        if (user && user._id) {
            return <Redirect to='/'/>
        }
        const form = this.props.form
        const {getFieldDecorator} = form;
        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo"/>
                    <h1>Backstage management system</h1>
                </header>
                <section className="login-content">
                    <h2>User Login</h2>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Item>
                            {
                                getFieldDecorator('username', {
                                    rules: [
                                        {required: true, whiteSpace: true, message: 'Username is required'},
                                        {min: 4, message: 'The username length cannot be less than 4 digits'},
                                        {max: 12, message: 'The username length cannot be greater than 12 digits'},
                                        {pattern: /^[a-zA-Z0-9_]+$/, message: 'Username must consist of English letters, numbers or underscores'}
                                    ]
                                })(
                                    <Input
                                        prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                        placeholder="user name"
                                    />
                                )
                            }
                        </Item>
                        <Form.Item>
                            {
                                getFieldDecorator('password', {
                                    rules: [
                                        {
                                            validator: this.validatePassword
                                        }
                                    ]
                                })(
                                    <Input
                                        prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                        type="password"
                                        placeholder="password"
                                    />
                                )
                            }
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                Login
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }
}

const WrapLogin = Form.create()(Login)
export default WrapLogin
