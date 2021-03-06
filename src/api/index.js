import ajax from "./ajax";
import jsonp from "jsonp";
import {message} from "antd";

const BASE = 'http://120.55.193.14:5000'

export const reqCategories = (parentId) => ajax(BASE + '/manage/category/list', {parentId})
export const reqAddCategories = (categoryName, parentId) => ajax(BASE + '/manage/category/add', {
    categoryName,
    parentId
}, 'POST')
export const reqUpdateCategories = ({parentId, categoryName}) => ajax(BASE + '/manage/category/update', {
    parentId,
    categoryName
}, 'POST')

export const reqLogin = (username, password) => ajax(BASE + '/login', {username, password}, 'POST')
export const reqAddUser = (user) => ajax(BASE + '/manage/user/add', user, 'POST')
export const reqProducts = (pageNum, pageSize) => ajax(BASE + '/manage/product/list', {pageNum, pageSize})
export const reqSearchProducts = ({
                                      pageNum,
                                      pageSize,
                                      searchName,
                                      searchType
                                  }) => ajax(BASE + '/manage/product/search', {
    pageNum,
    pageSize,
    [searchType]: searchName,
})
export const reqCategory = (categoryId) => ajax(BASE + '/manage/category/info', {categoryId})
export const reqUpdateStatus = (productId, status) => ajax(BASE + '/manage/product/updateStatus', {
    productId,
    status
}, 'POST')
export const reqDeleteImg = (name) => ajax(BASE + '/manage/img/delete', {name}, 'POST')
export const reqAddOrUpdateProduct = (product) => ajax(BASE + '/manage/product/' + (product._id ? 'update' : 'add'), product, 'POST')
export const reqRoles = () => ajax(BASE + '/manage/role/list')
export const reqAddRole = (roleName) => ajax(BASE + '/manage/role/add', {roleName}, 'POST')
export const reqUpdateRole = (role) => ajax(BASE + '/manage/role/update', role, 'POST')
export const reqUsers = () => ajax(BASE + '/manage/user/list')
export const reqDeleteUser = (userId) => ajax(BASE + '/manage/user/delete', {userId}, 'POST')
export const reqAddOrUpdateUser = (user) => ajax(BASE + '/manage/user/'+(user._id ? 'update' : 'add'), user, 'POST')

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
