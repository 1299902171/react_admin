import React, {Component} from 'react';
import {withRouter} from 'react-router-dom'
import {formateDate} from "../../utils/dateUtils";
import memoryUtils from "../../utils/memoryUtils";
import {reqWeather} from "../../api";
import menuList from "../../config/menuConfig";
import './index.less'

class Header extends Component {
    state = {
        currentTime: formateDate(Date.now()),
        dayPictureUrl: '',
        weather: '',
        city: '广州'
    }
    getTime = () => {
        setInterval(() => {
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

    render() {
        const {currentTime, dayPictureUrl, weather,city} = this.state
        const username = memoryUtils.user.username
        const title = this.getTitle()
        return (
            <div className='header'>
                <div className='header-top'>
                    <span>欢迎，{username}</span>
                    <a href='/login'>退出</a>
                </div>
                <div className='header-bottom'>
                    <div className='header-bottom-left'>{title}</div>
                    <div className='header-bottom-right'>
                        <span>当前时间：{currentTime}</span>
                        <span>当前温度：{dayPictureUrl}℃</span>
                        <span>当前城市：{city}</span>
                        <span>天气：{weather}</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Header);
