import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import menuList from '../../config/menuConfig'
import LinkButton from '../link-button/link-button'
import { formateDate } from '../../utils/dateUtils'
import { reqWeather } from '../../api/index'
import { Modal } from 'antd';

import './index.less'

/**
 * 头部组件
 */
class Header extends Component{
    state = {        
        currentTime: formateDate(Date.now()),// 当前时间字符串格式
        dayPictureUrl: '',    // 天气图片url
        weather: '',    // 天气的文本
    }
    // 获取天气
    getWeather = async () => {
        const { dayPictureUrl, weather } = await reqWeather('上海');
        this.setState({
            dayPictureUrl,
            weather
        })
    }
    // 获取title
    getTitle = () => {
        const path = this.props.location.pathname;
        let title;
        menuList.forEach(item => {
            // 如果当前item对象的key与path相等
            if (item.key === path) {
                title = item.title;
            } else if (item.children) {
                // 在所有子item中查找匹配的
                const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
                // 如果存在
                if (cItem)
                    title = cItem.title
            }
        })
        return title;
        
    }
    // 获取当前时间
    getTime = () => {
        this.timer = setInterval(() => {
            const currentTime = formateDate(Date.now())
            this.setState({ currentTime });
        },1000)
    }
    // 退出
    logOut = ()=> {
        // 显示确认框
        Modal.confirm({
            title: '确定退出登录吗?',
            onOk:()=> {
                // 删除保存的user数据
                memoryUtils.user = '';
                storageUtils.removeUser();
                this.props.history.replace('/login')
            }
        });
    }
    /**
     * 第一次render()之后执行一次，
     * 一般在此执行异步操作，发ajax请求/启动定时器
     */ 
    componentDidMount() {         
        this.getTime();
        this.getWeather()
    }
    // 当前组件卸载之前调用
    componentWillUnmount() {
        // 清楚定时器
        clearInterval(this.timer)
    }    
    render() {
        const { currentTime, dayPictureUrl, weather } = this.state;
        const username = memoryUtils.user.username;
        // 取出title
        const title = this.getTitle();
        return (
            <div className="header">
                <div className="header-top">
                    <span>欢迎，{ username } </span> 
                    <LinkButton onClick={this.logOut}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">
                        {title}
                    </div>
                    <div className="header-bottom-right">
                        <span>{ currentTime }</span>
                        <img src={dayPictureUrl} alt={dayPictureUrl}/>
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}


export default withRouter(Header)
