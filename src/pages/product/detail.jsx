import React, { Component } from 'react'
import {
    Card,
    Icon,
    List
} from 'antd'
import LinkButton from '../../components/link-button/link-button'
import './detail.less'
import { BASE_IMG_URL } from '../../utils/constants'
import { reqCategory } from '../../api/index.js'


const Item = List.Item

/**
 * 产品的详情
 */
export default class ProductDetail extends Component{
    state = {
        pCategoryName: '',
        categoryName: '',        
    }

    async componentDidMount() {
        const { pCategoryId, categoryId } = this.props.location.state.product
        let pCategoryName,categoryName
        if (pCategoryId === '0') {
            const result = await reqCategory(categoryId)
            pCategoryName = result.data.name
            this.setState({
                pCategoryName
            })
        } else {
            // 传统方式
            // const result = await reqCategory(pCategoryId)
            // pCategoryName = result.data.name
            // const result1 = await reqCategory(categoryId)  
            // categoryName = result1.data.name
            

            // promiseAll 方式
            const results = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)])
            pCategoryName = results[0].data.name
            categoryName = results[1].data.name
            this.setState({
                pCategoryName,
                categoryName
            })
        }
    }
    render() {
        const { product } = this.props.location.state;        
        const { categoryName,pCategoryName} = this.state
        const title = (
            <span>
                <LinkButton onClick={() => this.props.history.goBack()}>
                    <Icon type="arrow-left"></Icon>
                </LinkButton>
                <span>商品详情</span>
            </span>
        )
        return (
            <Card title={title} className="product-detail">
                <List>
                    <Item>
                        <span className="title">商品名称</span>
                        <span>{product.name}</span>
                    </Item>
                    <Item>
                        <span className="title">商品描述</span>
                        <span>{product.desc}</span>
                    </Item>
                    <Item>
                        <span className="title">商品价格</span>
                        <span>{product.price}</span>
                    </Item>
                    <Item>
                        <span className="title">商品分类</span>
                        <span>{pCategoryName} {categoryName?'--> ' + categoryName:""}</span>
                    </Item>
                    <Item>
                        <span className="title">商品图片</span>
                        <span>
                            {
                                product.imgs.map((item,key) => {
                                    return <img src={BASE_IMG_URL + item} key={key} alt={key} className="product-img"/>                                
                                })
                            }
                        </span>
                    </Item>
                    <Item>
                        <span className="title">商品详情</span>
                        <span dangerouslySetInnerHTML={{__html:product.detail}}></span>
                    </Item>
                </List>
            </Card>
        )
    }
}
