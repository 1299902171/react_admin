import React, {Component} from 'react';
import {Link, withRouter} from "react-router-dom";
import {Menu, Icon,} from "antd";
import logo from '../../assets/images/logo.png'
import menuList from "../../config/menuConfig";
import './index.less'
import memoryUtils from "../../utils/memoryUtils";

const SubMenu = Menu.SubMenu;

class LeftNav extends Component {
    hasAuth = (item) => {
        const {key, isPublic} = item
        const menus = memoryUtils.user.role.menus
        const username = memoryUtils.user.username
        if (username === 'admin' || isPublic || menus.indexOf(key) !== -1) {
            return true
        } else if (item.children) {
            return !!item.children.find(child => menus.indexOf(child.key) !== -1)
        }
        return false
    }
    getMenuNodes = (menuList) => {
        const path = this.props.location.pathname
        return menuList.reduce((pre, item) => {
            if (this.hasAuth(item)) {
                if (!item.children) {
                    pre.push((
                        <Menu.Item key={item.key}>
                            <Link to={item.key}>
                                <Icon type={item.icon}/>
                                <span>{item.title}</span>
                            </Link>
                        </Menu.Item>
                    ))
                } else {
                    const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
                    if (cItem) {
                        this.openKey = item.key
                    }
                    pre.push((
                        <SubMenu key={item.key} title={
                            <span>
                        <Icon type={item.icon}/>
                        <span>{item.title}</span>
                    </span>
                        }>
                            {this.getMenuNodes(item.children)}
                        </SubMenu>
                    ))
                }
            }

            return pre
        }, [])
    }
    getMenuNodes_map = (menuList) => {
        return menuList.map(item => {
            if (!item.children) {
                return (
                    <Menu.Item key={item.key}>
                        <Link to={item.key}>
                            <Icon type={item.icon}/>
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                )
            } else {
                return (
                    <SubMenu key={item.key} title={
                        <span>
                        <Icon type={item.icon}/>
                        <span>{item.title}</span>
                    </span>
                    }>
                        {this.getMenuNodes_map(item.children)}
                    </SubMenu>
                )
            }
        })
    }

    componentWillMount() {
        this.menuNodes = this.getMenuNodes(menuList)
    }

    render() {
        let path = this.props.location.pathname
        if (path.indexOf('/product') === 0) {
            path = '/product'
        }
        const openKey = this.openKey
        return (
            <div className='left-nav'>
                <Link to='/' className='left-nav-header'>
                    <img src={logo} alt='logo'/>
                    <h1>Background System</h1>
                </Link>
                <Menu defaultSelectedKeys={['/home']} selectedKeys={[path]} defaultOpenKeys={[openKey]} mode='inline'
                      theme='dark'>
                    {
                        this.menuNodes
                    }
                </Menu>

            </div>

        );
    }
}

export default withRouter(LeftNav);
