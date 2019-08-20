import React, { Component } from 'react'
import {
    Card,
    Table,
    Button,
    Icon,
    message,
    Modal
} from 'antd'
import LinkButton from '../../components/link-button/link-button'
import { reqCategorys,reqAddCategory,reqUpdateCategory } from '../../api'
import AddForm from './add-form'
import UpdateForm from './update-form'

/**
 * 商品分类组件
 */
export default class Category extends Component {
    state = {
        loading: false,
        categorys: [],   // 一级分类列表
        subCategorys: [],    // 二级分类列表
        parentId: '0',   // 当前需要显示的分类列表parentId
        parentName: '', //
        showStatus:0,   // 标识添加/修改确认框是否显示，0：都不显示，1，显示添加，2，显示修改
    }
    //初始化table的所有
    initColumns = () => {
        this.columns = [
            {
                title: "分类名称",
                dataIndex: "name",
                render: (text,category) => (
                    <span>
                        {
                            this.state.parentId === '0' ? <LinkButton onClick={() => this.showSubCategorys(category)} >{text}</LinkButton> :  text
                        }
                    </span>
                )
            },
            {
                title: "操作",
                width: 300,
                // 返回需要显示的界面标签
                render: (category) => (
                    <span>
                        <LinkButton onClick={() => this.showUpdate(category)}>修改分类</LinkButton>                        
                        {/* 如何向事件回调函数传递参数，先定义一个函数，在函数中调用处理函数并传入数据 */}
                        {this.state.parentId==='0'?<LinkButton onClick={() => this.showSubCategorys(category)} >查看子分类</LinkButton>:null}
                    </span>
                )
            }
        ];
    }
    /** 
     *  异步获取一/二级分类列表显示
     *  parentId：如果没有指定 根据状态中的parentId请求，如果指定，按照指定的parentId请求
     */ 
    getCategorys = async (parentId) => {
        this.setState({
            loading: true
        })
        parentId = parentId || this.state.parentId
        const result = await reqCategorys(parentId)
        this.setState({
            loading: false
        })
        if (result.status === 0) {
            // 取出分类数据(可能是一级，也可能是二级)            
            const categorys = result.data;
            if (parentId === '0') {
                this.setState({
                    categorys
                })
            } else {
                this.setState({
                    subCategorys: categorys
                })
            }
        } else {
            message.error('获取分类列表失败！')
        }
    }
    // 根据parentId读取二级分类
    showSubCategorys = (category) => {
        // 更新状态
        this.setState({
            parentId: category._id,
            parentName: category.name
        }, () => {        
            // 获取二级分类列表显示
            this.getCategorys(this.state.parentId)
        })
        // setState()不能立即获取最新状态，因为setState()是异步更新状态的
    }
    // 显示一级分类列表
    showCategorys = () => {
        this.setState({
            parentId: '0',
            parentName: '',
            subCategorys: [],
        })
    }
    // 关闭确认框
    handleCancel = () => {
        // 隐藏确认框
        this.setState({
            showStatus:0
        })
        // 重置，清空输入数据
        this.form.resetFields();
    }
    // 显示添加分类确认框
    showAdd = () => {
        this.setState({
            showStatus:1
        })
    }
    // 显示修改分类确认框
    showUpdate = (category) => {
        // 保存分类对象
        this.category = category
        this.setState({
            showStatus:2
        })
    }
    // 添加分类
    addCategory = () => {
        // 表单验证，通过了才处理
        this.form.validateFields(async (err, values) => {
            if (!err) {
                this.setState({
                    showStatus:0
                })
                const { parentId, categoryName } = values
                // 重置，清空输入数据
                this.form.resetFields();
                const result = await reqAddCategory(categoryName,parentId)
                if (result.status === 0) {
                    // 重新显示列表
                    if (parentId === this.state.parentId) {
                        this.getCategorys();                            
                    } else if(parentId ==='0') {
                        this.getCategorys('0')
                    }
                }
            }
        })
    }
    // 修改分类
    updateCategory = () => {
        this.form.validateFields(async (err, values) => {
           if(!err){
                // 隐藏确认框
                this.setState({
                    showStatus:0
                })
                const categoryId = this.category._id;
                const {categoryName} = values;
                // 发送请求更新数据
                const result = await reqUpdateCategory({ categoryId, categoryName })
                // 重置，清空输入数据
                this.form.resetFields();
                if (result.status === 0) {
                    // 重新显示列表
                    this.getCategorys();            
                }
           }
       })
    }
    // 为第一次render()准备数据
    componentWillMount() {
        this.initColumns()
    }
    // 执行异步任务：发异步ajax请求
    componentDidMount() {
        // 获取一级分类列表显示
        this.getCategorys();
    }
    render() {
        // 读取状态数据
        const { categorys, subCategorys, parentId, parentName, loading, showStatus } = this.state
        const category = this.category || {}    // 如果没有赋值为空，
        const title = parentId === '0' ? '一级分类列表' : (
            <span>
                <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
                <Icon type="arrow-right" style={{marginRight:5}}></Icon>
                <span>{parentName}</span>                 
            </span>
        )        
        const extra = (
            <Button type="primary" onClick={this.showAdd}><Icon type='plus'></Icon>添加</Button>
        )
        return (
            <Card title={title} extra={extra}>
                <Table
                    dataSource={parentId === '0' ? categorys : subCategorys}
                    columns={this.columns}
                    bordered
                    rowKey="_id"
                    loading={loading}
                    pagination={{ defaultPageSize: 10, showQuickJumper: true }}
                />
                <Modal
                    title="添加分类"
                    visible={showStatus===1}
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}
                >
                    <AddForm
                        categorys={categorys}
                        parentId={parentId}
                        setForm={(form) => { this.form = form }}
                    />
                </Modal>
                <Modal
                    title="修改分类"
                    visible={showStatus===2}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}
                >
                    <UpdateForm
                        categoryName={category.name}
                        setForm={(form) => { this.form = form }}
                    />
                </Modal>
            </Card>
        )
    }
}
