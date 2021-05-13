import ajax from "./ajax";
import jsonp from "jsonp";
import {message} from "antd";

const BASE = ''

export const reqLogin = (username, password) => ajax(BASE + '/login', {username, password}, 'POST')
export const reqAddUser = (user) => ajax(BASE + '/manage/user/add', user, 'POST')
export function reqWeather(city) {
    // const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
    const url = `http://wthrcdn.etouch.cn/weather_mini?city=${city}`
    return new Promise((resolve, reject) => {
        jsonp(url, {
            param: 'callback'
        }, (error, response) => {
            if (!error && response.status === 1000) {
                // const {dayPictureUrl, weather} = response.results[0].weather_data[0]
                const weather = response.data.forecast[0].type
                const dayPictureUrl = response.data.wendu
                resolve({dayPictureUrl, weather})
            } else {
                message.error('获取天气信息失败')
            }
        })
    })
}
