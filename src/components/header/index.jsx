import React, {Component} from 'react';
import {withRouter} from 'react-router-dom'
import {formateDate} from "../../utils/dateUtils";
import {Modal} from "antd";
import memoryUtils from "../../utils/memoryUtils";
import {reqWeather} from "../../api";
import menuList from "../../config/menuConfig";
import './index.less'
import storageUtils from "../../utils/storageUtils";
import LinkButton from "../link-button";

class Header extends Component {
    state = {
        currentTime: formateDate(Date.now()),
        dayPictureUrl: '',
        weather: '',
        city: '成都'
    }
    logout = () => {
        Modal.confirm({
            title: 'Log out',
            content: 'Are you sure you want to exit?',
            onOk: () => {
                storageUtils.removeUser()
                memoryUtils.user = {}
                this.props.history.replace('/login')
            },
        })
    }
    getTime = () => {
        this.intervalId = setInterval(() => {
            const currentTime = formateDate(Date.now())
            this.setState({currentTime})
        }, 1000)
    }
    getWeather = async () => {
        const city = this.state.city
        const {dayPictureUrl, weather} = await reqWeather(city)
        this.setState({dayPictureUrl, weather})
    }
    getTitle = () => {
        const path = this.props.location.pathname
        let title
        menuList.forEach(item => {
            if (item.key === path) {
                title = item.title
            } else if (item.children) {
                const cItem = item.children.find(cItem => cItem.key === path)
                if (cItem) {
                    title = cItem.title
                }
            }
        })
        return title
    }

    componentDidMount() {
        this.getTime()
        this.getWeather()
    }

    componentWillUnmount() {
        clearInterval(this.intervalId)
    }

    render() {
        const {currentTime, dayPictureUrl, weather, city} = this.state
        const username = memoryUtils.user.username
        const title = this.getTitle()
        return (
            <div className='header'>
                <div className='header-top'>
                    <span>Welcome，{username}</span>
                    <LinkButton onClick={this.logout}>Log out</LinkButton>
                </div>
                <div className='header-bottom'>
                    <div className='header-bottom-left'>{title}</div>
                    <div className='header-bottom-right'>
                        <span>CurrentTime：{currentTime}</span>
                        <span>CurrentTemperature：{dayPictureUrl}℃</span>
                        <span>CurrentCity：{city}</span>
                        <span>Weather：{weather}</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Header);
