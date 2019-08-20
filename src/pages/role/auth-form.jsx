import React, { Component } from 'react'
import {
    Form,
    Tree,
    Input,
} from 'antd'
import PropTypes from 'prop-types'
import menuList from '../../config/menuConfig'

const { Item } = Form
const { TreeNode } = Tree

/**
 * 角色tree
 */
export default class AuthForm extends Component{
    static propTypes = {
        role: PropTypes.object        
    }
    constructor(props) {
        super(props)
        const { menus } = this.props.role        
        this.state = {
            checkedKeys : menus
        }
    }
    // 为父组件得到最新的tree数据
    getMenus = () => this.state.checkedKeys
    // 根据菜单配置文件 渲染树形结构
    getTreeNodes = (menuList) => { 
        return menuList.reduce((pre, item) => {
            pre.push(
                <TreeNode title={item.title} key={item.key}>
                    {item.children?this.getTreeNodes(item.children):null}
                </TreeNode>
            )    
            return pre
        },[])
    }
    // 选中某一个node的时候
    onCheck = checkedKeys => {
        this.setState({ checkedKeys });
    }
    componentWillMount() {
        this.treeNodes = this.getTreeNodes(menuList);
    }
    /**
     * 根据新传入的role来更新checkedKeys状态
     * 当组件接受到新的属性时自动调用
     */
    componentWillReceiveProps(nextProps) {
        const menus = nextProps.role.menus
        this.setState({
            checkedKeys:menus
        })
    }
    render() {
        const { role } = this.props
        const { checkedKeys } = this.state        
        return (
            <div>
                <Item label="角色名称" labelCol={{ span: 5}} wrapperCol={{ span: 18 }}>
                    <Input value={role.name} disabled/>
                </Item>
                <Tree
                    checkable
                    defaultExpandAll={true}
                    checkedKeys={checkedKeys}
                    onCheck={this.onCheck}
                >
                    <TreeNode title="平台权限" key="all">
                        {this.treeNodes}
                    </TreeNode>
                </Tree>
            </div>
        )
    }
}
