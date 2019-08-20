/**
 * 使用sore，兼容浏览器，语法更简洁
 */
import store from 'store'
/**
 * 进行local数据存储管理的工具模块
 */
const USER_KEY = 'user_key'
export default {
     /**
      * 保存user
      */
    saveUser(user) {
        // localStorage.setItem(USER_KEY,JSON.stringify(user))
        // 使用store 
        store.set(USER_KEY,user)
    },
    /**
     * 读取user
     */
    getUser() {
        // return JSON.parse(localStorage.getItem(USER_KEY) || '{}');
        return store.get(USER_KEY || {})        
    },
    /**
     * 删除user
     */
    removeUser() {
        // localStorage.removeItem(USER_KEY);
        store.remove(USER_KEY)
    }
 }