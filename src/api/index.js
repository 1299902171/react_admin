import ajax from "./ajax";
import jsonp from "jsonp";
import {message} from "antd";

const BASE = 'http://120.55.193.14:5000'
// const BASE = 'http:zlx.cool:5000'

export const reqCategories = (parentId) => ajax(BASE + '/manage/category/list', {parentId})
export const reqAddCategories = (categoryName,parentId) => ajax(BASE + '/manage/category/add', {categoryName,parentId},'POST')
export const reqUpdateCategories = ({parentId,categoryName}) => ajax(BASE + '/manage/category/update', {parentId,categoryName},'POST')

export const reqLogin = (username, password) => ajax(BASE + '/login', {username, password}, 'POST')
export const reqAddUser = (user) => ajax(BASE + '/manage/user/add', user, 'POST')

export function reqWeather(city) {
    const url = `http://wthrcdn.etouch.cn/weather_mini?city=${city}`
    return new Promise((resolve, reject) => {
        jsonp(url, {
            param: 'callback'
        }, (error, response) => {
            if (!error && response.status === 1000) {
                const weather = response.data.forecast[0].type
                const dayPictureUrl = response.data.wendu
                resolve({dayPictureUrl, weather})
            } else {
                message.error('Failed to get weather information')
            }
        })
    })
}
