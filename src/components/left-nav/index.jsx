import React, {Component} from 'react';
import {Link, withRouter} from "react-router-dom";
import {Menu, Icon,} from "antd";
import logo from '../../assets/images/logo.png'
import menuList from "../../config/menuConfig";
import './index.less'

const SubMenu = Menu.SubMenu;

class LeftNav extends Component {
    getMenuNodes = (menuList) => {
        const path = this.props.location.pathname
        return menuList.reduce((pre, item) => {
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
                const cItem = item.children.find(cItem => cItem.key === path)
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
        // const menuNodes = this.getMenuNodes(menuList)
        const path = this.props.location.pathname
        const openKey = this.openKey
        return (
            <div className='left-nav'>
                <Link to='/' className='left-nav-header'>
                    <img src={logo} alt='logo'/>
                    <h1>后台管理系统</h1>
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
