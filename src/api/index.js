/**
 * 要求，能根据接口文档定义接口请求函数
 * 包含应用中所有的请求函数
 * 每个函数都是返回promise
 */
import Jsonp from 'jsonp'
import ajax from './ajax'
import { message } from 'antd'

// const BASE = 'http://localhost:5000'
const BASE = ''

// 登录
// export function reqLogin(username,password) {
//     return ajax('/login', { uaername, password }, 'POST');
// }
export const reqLogin = (username, password) => ajax(BASE + '/login', {
    username,
    password
}, 'POST');

// 添加分类
export const reqAddCategory = (categoryName, parentId) => ajax(BASE + '/manage/category/add', {categoryName, parentId },'POST')
// 修改分类
export const reqUpdateCategory = ({categoryId,categoryName}) => ajax(BASE + '/manage/category/update', {categoryId,categoryName },'POST')
// 读取一级/二级分类
export const reqCategorys = (parentId) => ajax(BASE + '/manage/category/list', { parentId })
// 读取某一个分类
export const reqCategory = (categoryId) => ajax(BASE + '/manage/category/info', { categoryId })

// 添加/修改商品
export const reqAddOrUpdateProduct = (product) => ajax(BASE + '/manage/product/' + (product._id ? 'update' : 'add'), product, 'POST')
// 商品分页列表
export const reqProducts = ( pageNum , pageSize ) => ajax(BASE + '/manage/product/list', { pageNum , pageSize})
// 搜索商品分页列表(根据商品名称/商品描述)
export const reqSearchProducts = ({ pageNum, pageSize, searchName, searchType }) => ajax(BASE + '/manage/product/search', {    
    pageNum,
    pageSize,
    [searchType]: searchName    
})
// 修改商品状态，上架/下架
export const reqProductUpdateStatus = (productId, status) => ajax(BASE + '/manage/product/updateStatus', { productId, status }, 'POST')

// 角色管理
// 获取所有角色列表
export const reqRoles = () => ajax(BASE + '/manage/role/list') 
// 添加角色
export const reqAddRole = (roleName) => ajax(BASE + '/manage/role/add', { roleName }, 'POST') 
// 更新角色权限
export const reqUpdateRole = (role) => ajax(BASE + '/manage/role/update',  role , 'POST') 

// 用户相关
// 获取用户列表
export const reqUsers = () => ajax(BASE + '/manage/user/list') 
// 删除指定用户
export const reqDeleteUser = (userId) => ajax(BASE + '/manage/user/delete', { userId }, 'POST') 
// 添加用户
export const reqAddUser = (user) => ajax(BASE + '/manage/user/add', user, 'POST')


// 更新用户
export const reqUpdateUser = (user) => ajax(BASE + '/manage/user/update', user, 'POST') 



// 删除指定名称的图片
export const reqDeleteImg = (name) => ajax(BASE+'/manage/img/delete',{name},'POST')

/**
 * jsonp 请求的接口 天气 请求函数
 */
export const reqWeather = (city) => {
    return new Promise((resolve, reject) => {
        const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`;
        // 发送jsonp请求
        Jsonp(url, {}, (err, data) => {
            // console.log(data.results[0].weather_data[0]);
            // 成功
            if (!err && data.status === 'success') {
                const {
                    dayPictureUrl,
                    weather
                } = data.results[0].weather_data[0];
                resolve({ dayPictureUrl, weather })                
            } else {
                message.error('获取天气信息失败！')
            }
            // 失败
        })
    })

}