/**
 * 能发送异步ajax请求的函数模块
 * 封装axios库
 * 函数的返回值是promise对象
 * 优化1
 *  统一处理请求异常
 *  在外层包一个自己创建的promise
 *  在请求出错时不去reject(error)，而是显示错误提示
 * 优化2
 *  异步得到不是reponse,而是reponse.data
 */ 
import axios from 'axios';
import { message } from 'antd';

export default function ajax(url, data = {}, type = 'GET') {
    return new Promise((resolve, reject) => {
        let promise;
        // 执行异步ajax请求
        if (type === 'GET') {
            promise = axios.get(url, {
                params: data            
            });
        } else {
            promise = axios.post(url, data);        
        }
        // 如果成功了，调用resolve(value)
        promise.then(res => {
            resolve(res.data);
        // 如果失败了，不调用reject(reason)，而是提示异常信息
        }).catch(err => {
            message.error('请求出错了：' + err.message)
        })
    })    
}