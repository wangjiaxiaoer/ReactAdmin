import React, { Component } from 'react'
import {
    Card,
    Button,
    Table,
    message,
    Modal
} from 'antd'
import { PAGE_SIZE } from '../../utils/constants'
import { reqRoles, reqAddRole, reqUpdateRole } from '../../api/index'
import AddForm from './add-form'
import AuthForm from './auth-form'
import memoryUtils from '../../utils/memoryUtils.js'
import {formateDate} from '../../utils/dateUtils'
import storageUtils from '../../utils/storageUtils'


/**
 * 角色路由
 */
export default class Role extends Component{
    state = {
        showStatus:0,
        roles: [],
        role:{},
        loading: false,
    }
    constructor(props) {
        super(props)
        this.auth = React.createRef()
    }
    //初始化table的所有
    initColumns = () => {
        this.columns = [
            {
                title: "角色名称",
                dataIndex: "name",
            },
            {
                title: "创建时间",
                dataIndex: "create_time",                
                render: formateDate
            },
            {
                title: "授权时间",
                dataIndex: "auth_time",
                render: formateDate
            },
            {
                title: "授权人",
                dataIndex: "auth_name",
            },
        ];
    }
    // 点击行
    onRow = (role) => {
        return {
            onClick: event => {
                this.setState({
                   role
               })
            }
        }
    }
    // 显示添加角色框
    showAdd() {
        this.setState({
            showStatus:1,
        })
    }
    // 添加角色
    addRole = async () => {
        this.form.validateFields(async (err, values) => {
            if (!err) {
                this.setState({
                    showStatus:0
                })
                const { roleName } = values
                // 重置，清空输入数据
                this.form.resetFields();
                const result = await reqAddRole(roleName)
                if (result.status === 0) {
                    // 重新显示列表
                    message.success('添加角色成功')
                    // this.getRoles();
                    const role = result.data
                    // 不建议
                    // const roles = this.state.roles
                    // const roles = [...this.state.roles]
                    // // 添加
                    // roles.push(role)
                    // // 删除
                    // // this.replace(role)
                    // this.setState({
                    //     role
                    // })

                    // 更新roles状态：基于原本状态数据更新
                    this.setState(state  => ({
                        roles: [...state.roles, role]                        
                    }))
                }else {
                    message.error('添加角色失败')            
                }
            }
        })
    }
    // 设置更新权限
    setRoleAuth = async () => {
        this.setState({
            showStatus:0
        })
        const role = this.state.role
        // 得到tree的最新数据
        const menus = this.auth.current.getMenus();
        role.menus = menus;        
        role.auth_name = memoryUtils.user.username

        const result = await reqUpdateRole(role);
        if (result.status === 0) {
            message.success('设置角色权限成功')
            // 如果当前更新的是自己的角色权限，强制退出
            if (role._id === memoryUtils.user.role._id) {
                memoryUtils.user = {}                
                storageUtils.removeUser()
                this.props.history.replace('/login')
            } else {
                this.getRoles();
                // this.setState({
                //     roles:[...this.state.roles]
                // })
            }            
        } else {
            message.err('设置角色权限失败')
        }
    }
    // 隐藏模态框
    handleCancel= ()=> {
        // this.form.resetFields();
        this.setState({
            showStatus: 0,
        })
    }
    // 获取角色列表函数
    getRoles = async () => {
        const result = await reqRoles()
        if (result.status === 0) {
            const roles = result.data
            this.setState({
                roles
            })
        }
    }
    componentDidMount() {
        this.getRoles()
    }
    // 为第一次render()准备表格数据
    componentWillMount(){
        this.initColumns();
    }    
    render() {
        const { roles, loading,role,showStatus } = this.state
        const title = (
            <span>                           
                <Button type="primary" onClick={() =>  this.showAdd() } style={{marginRight:20}}>创建角色</Button>
                <Button type="primary" disabled={!role._id} onClick={() =>  this.setState({showStatus:2}) }>设置角色权限</Button>
           </span>
        )
        return (            
            <Card title={title}>
                <Table
                    onRow={this.onRow}
                    rowSelection={{
                        type: 'radio',
                        selectedRowKeys: [role._id],
                        onSelect: (role) => {
                            this.setState({
                                role
                            })
                        }
                    }}
                    dataSource={roles}
                    columns={this.columns}
                    bordered
                    rowKey="_id"
                    loading={loading}
                    pagination={{
                        defaultPageSize: PAGE_SIZE
                    }}
                />
                <Modal
                    title="添加角色"
                    visible={showStatus===1}
                    onOk={this.addRole}
                    onCancel={this.handleCancel}
                >
                    <AddForm
                        setForm={(form) => { this.form = form }}
                    />
                </Modal>
                <Modal
                    title="设置角色权限"
                    visible={showStatus===2}
                    onOk={this.setRoleAuth}
                    onCancel={this.handleCancel}
                >
                    <AuthForm role={role} ref={this.auth} />                        
                </Modal>
            </Card>
            
        )
    }
}
