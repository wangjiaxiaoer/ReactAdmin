import React, { Component } from 'react'
import { formateDate } from '../../utils/dateUtils'
import { PAGE_SIZE } from '../../utils/constants'
import LinkButton from '../../components/link-button/link-button'
import UserForm from './user-form'
import { reqUsers,reqDeleteUser,reqAddUser,reqUpdateUser } from '../../api/index'
import {
    Card,
    Button,
    Table,
    Modal,
    message
} from 'antd'

/**
 * 用户路由
 */
export default class User extends Component{
    state = {
        showStatus: false,
        loading:false,
        users: [],
        roles:[],
    }
    //初始化table的所有
    initColumns = () => {
        this.columns = [
            {
                title: "用户名",
                dataIndex: "username",
            },
            {
                title: "邮箱",
                dataIndex: "email"   
            },
            {
                title: "电话",
                dataIndex: "phone",
            },
            {
                title: "创建时间",
                dataIndex: "create_time",                
                render: formateDate
            },
            {
                title: "所属角色",
                dataIndex: "role_id",   
                // render: (role_id) => this.state.roles.find(role => role._id === role_id).name
                render: (role_id) => this.roleNames[role_id]
                
            },
            {
                title: "操作",
                width: 150,
                // 返回需要显示的界面标签
                render: (user) => (
                    <span>
                        <LinkButton onClick={()=>this.updateUser(user)}>修改</LinkButton>                        
                        <LinkButton onClick={()=>this.deleteUser(user) }>删除</LinkButton>       
                    </span>
                )
            }
        ];
    }
    // 根据role的数组，生成包含所有角色名的对象(属性名用角色id值)
    initRoleNames = (roles) => {
        const roleNames = roles.reduce((pre, role) => {
            pre[role._id] = role.name
            return pre
        },{})
        // 保存
        this.roleNames = roleNames
    }
    // 删除用户
    deleteUser =  (user) => {
        Modal.confirm({
            title: "确认删除" + user.username + "吗？",
            onOk: async ()=> {
                const result = await reqDeleteUser(user._id)
                if (result.status === 0) {
                    message.success("删除用户成功")
                    this.getUsers()
                } else {
                    message.error("删除用户失败")
                }
            }
        })
    }
    // 获取所有用户
    getUsers = async () => {
        const result = await reqUsers();
        if (result.status === 0) {
            const { users, roles } = result.data
            this.initRoleNames(roles)
            this.setState({
                users,
                roles,
            })
        }
            
    }
    componentDidMount() {
        this.getUsers()
    }
    componentWillMount() {
       this.initColumns()
    }
    // 显示修改用窗口
    updateUser = (user) => {
        this.user = user
        this.setState({
            showStatus:true
        })
    }
    // 显示添加窗口
    showAdd = () => {        
        // 添加之前情况user
        this.user = null
        this.setState({ showStatus: true })
    }
    // 关闭弹窗
    handleCancel = () => {
        this.setState({ showStatus: false })
        // 清空上一次添加的数据
        this.form.resetFields()                
    }
    // 添加用户
    addOrUpdateUser = async () => {
        this.setState({
            showStatus:false
        })
        // 收集数据
        const user = this.form.getFieldsValue()
        // 清空上一次添加的数据
        this.form.resetFields()
        debugger
        if (!this.user) {
            // 提交请求
            const result = await reqAddUser(user)
            if (result.status === 0) {
                message.success('添加用户成功~')
                // 更新列表显示
                this.getUsers();
            } else {
                message.error(result.msg)
            }
        } else { 
            user._id = this.user._id
            // 提交请求
            const result = await reqUpdateUser(user)
            if (result.status === 0) {
                message.success('修改用户成功~')
                // 更新列表显示
                this.getUsers();
            } else {
                message.error(result.msg)
            }
        }
    }
    render() {
        let { users, loading,showStatus,roles } = this.state
        // showStatus = true
        const user = this.user || {}
        const title = <Button onClick={this.showAdd} type="primary">创建用户</Button>        
        return (
            <Card title={title}>
                <Table
                    dataSource={users}
                    columns={this.columns}
                    bordered
                    rowKey="_id"
                    loading={loading}
                    pagination={{
                        defaultPageSize: PAGE_SIZE
                    }}
                />
                <Modal
                    title={user._id?"修改用户":"添加用户"}
                    visible={showStatus}
                    onOk={this.addOrUpdateUser}
                    onCancel={this.handleCancel}
                >
                    <UserForm
                        setForm={(form) => { this.form = form }}
                        roles={roles}
                        user={user}
                    />
                </Modal>
            </Card>
        )
    }
}
