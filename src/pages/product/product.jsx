import React, { Component } from 'react'
import { Redirect, Switch, Route } from 'react-router-dom'
import ProductHome from './home'
import ProductAddUpdate from './add-update'
import ProductDetail from './detail'
/**
 * 商品管理路由
 */
export default class Product extends Component{
   render() {
       return (
           <Switch>
               {/* exact 路径完全匹配 */}
               <Route path='/product' component={ProductHome} exact />
               <Route path='/product/detail' component={ProductDetail} />
               <Route path='/product/addupdate' component={ProductAddUpdate} />
               <Redirect to='/product' />
            </Switch>
        )
    }
}
