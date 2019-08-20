import React, { Component } from 'react'
import {
    Card,
    Select,
    Input,
    Button,
    Icon,
    Table,
    message,
} from 'antd'
import LinkButton from '../../components/link-button/link-button'
import { PAGE_SIZE, BASE_IMG_URL } from '../../utils/constants'
import { reqProducts, reqSearchProducts,reqProductUpdateStatus } from '../../api/index'

const Option = Select.Option;

/**
 * ProductHome,product的默认子路由
 */
export default class ProductHome extends Component{
    state = {
        loading: false,
        products: [],
        total: 0,
        searchName: '',   // 搜索的关键字
        searchType:'productName'       // 根据哪个字段搜索
    }
    //初始化table的所有
    initColumns = () => {
        this.columns = [
            {
                title: "商品名称",
                dataIndex: "name",                
                width: 300,
                render: (text,product) => (
                    <span>
                        {
                            this.state.parentId === '0' ? <LinkButton onClick={() => this.showSubCategorys(product)} >{text}</LinkButton> :  text
                        }
                    </span>
                )
            },
            {
                title: "商品描述",
                dataIndex: "desc",
            },
            {
                title: "图片",
                dataIndex: "imgs",
                render: (record) => (
                    <span>
                        {
                            record.map((item,key) => {
                                return <img src={BASE_IMG_URL + item} key={key} alt={key} style={{ height:'50px'}}/>     
                            })
                        }
                    </span>
                )
            },
            {
                title: "价格",
                dataIndex: "price",
                width: 150,
                render: (text) => (
                    <span>￥{text}</span>
                )
            },
            {
                title: "状态",
                // dataIndex:"status",
                width: 100,
                render: (product) => {
                    const {status,_id} = product
                    return (
                        <span style={{ display:"block",textAlign:"center"}}>
                            <Button
                                type='primary'
                                style={{ marginBottom: 5 }}
                                onClick={() => this.updateStatus(_id, status===1?2:1)}
                            >
                                {status === 1 ? '下架' : '上架'}
                            </Button>
                            <span style={{display:"block",width:"100%"}}>{status === 1 ? '在售' : '已下架'}</span>
                        </span>
                    )
                }
            },
            {
                title: "操作",
                width: 120,
                // 返回需要显示的界面标签
                render: (product) => (
                    <span>
                        <LinkButton onClick={() =>  this.props.history.push('/product/addupdate',product)}>修改</LinkButton>                        
                        <LinkButton onClick={() => this.props.history.push('/product/detail',{product})}>详情</LinkButton>       
                    </span>
                )
            }
        ];
    }
    // 读取数据
    getProducts = async (pageNum) => {
        this.pageNum = pageNum
        this.setState({
            loading:true
        })
        const { searchName, searchType } = this.state
        // 搜索分页
        let result        
        if (searchName) {
            result = await reqSearchProducts({ pageNum, pageSize: PAGE_SIZE, searchName, searchType })
        } else {
            result = await reqProducts(pageNum, PAGE_SIZE)
        }
        this.setState({
            loading: false
        })
        
        if (result.status === 0) {
            const { total, list } = result.data
            this.setState({
                products: list,
                total
            })
        }
    }
    // 更新商品状态
    updateStatus = async (productId,status) => {
        const result = await reqProductUpdateStatus(productId, status)
        if (result.status === 0) {
            message.success('更新状态成功')
            this.getProducts(this.pageNum)
        } else {
            message.error('更新状态失败')            
        }
    }
    // 初次加载产品列表
    componentDidMount() {
        this.getProducts(1);
    }
    // 为第一次render()准备表格数据
    componentWillMount(){
        this.initColumns();
    }
    render() {
        const { loading, products, total, searchName, searchType } = this.state
        const title = (
            <span>
                <Select value={searchType} style={{ width: 120 }} onChange={value => this.setState({ searchType: value })}>
                    <Option value="productName">按名称搜索 </Option>
                    <Option value="productDesc">按描述搜索 </Option>
                </Select>
                <Input
                    placeholder="关键字"
                    style={{ width: 200, margin: '0 10px', }}
                    value={searchName}
                    onChange={e => this.setState({ searchName: e.target.value })} />                
                <Button type="primary" onClick={() =>  this.getProducts(1) }>
                    搜索
                </Button>
           </span>
        )
        const extra = (
            <Button type="primary" onClick={() => { this.props.history.push('/product/addupdate') }}>                
                <Icon type="plus"></Icon>
                添加商品
            </Button>
        )
        return (
            <Card title={title} extra={extra}>
                <Table
                    dataSource={products}
                    columns={this.columns}
                    bordered
                    rowKey="_id"
                    loading={loading}
                    pagination={{
                        defaultPageSize: PAGE_SIZE,
                        showQuickJumper: true,
                        total,
                        current:this.pageNum,
                        onChange:this.getProducts
                    }}
                />
            </Card>
        )
    }
}
