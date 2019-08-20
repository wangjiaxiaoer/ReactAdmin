import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import {
    Input,
    Form,
    Select
} from 'antd'

const Item = Form.Item
const Option = Select.Option
/**
 * 添加用户修改用户的组件
 */
class UserForm extends PureComponent {
    // 传参
    static propTypes = {
        setForm:PropTypes.func.isRequired,
        roles: PropTypes.array.isRequired,
        user:PropTypes.object
    }
    componentWillMount() {
        // 将form对象通过setForm()传递父组件
        this.props.setForm(this.props.form);
    }
    render() {
        const { roles,user } = this.props;
        const { getFieldDecorator } = this.props.form;
        return (
            <Form labelCol={{ span: 5}} wrapperCol={{ span: 18 }}>
                <Item label="用户名" >
                    {
                        getFieldDecorator('username', {
                            initialValue: user.username,
                            rules: [{ required: true, message: '用户名称不能为空!' }]                            
                        })(
                            <Input placeholder='请输入用户名称'></Input>
                        )
                    }
                </Item>
                {
                    // 如果是修改，则不显示密码
                    user._id ? null : (
                        <Item label="密码">
                            {
                                getFieldDecorator('password', {
                                    initialValue: user.password,
                                    rules: [{ required: true, message: '用户密码不能为空!' }]                            
                                })(
                                    <Input placeholder='请输入用户密码' type="password"></Input>
                                )
                            }
                        </Item>
                    )
                }
                <Item label="手机号">
                    {
                        getFieldDecorator('phone', {
                            initialValue: user.phone,
                        })(
                            <Input placeholder='请输入角色名称'></Input>
                        )
                    }
                </Item>
                <Item label="邮箱">
                    {
                        getFieldDecorator('email', {
                            initialValue: user.email,
                        })(
                            <Input placeholder='请输入角色名称'></Input>
                        )
                    }
                </Item>
                <Item label="角色">
                    {
                        getFieldDecorator('role_id', {
                            initialValue: user.role_id ? user.role_id : undefined,
                        })(
                            <Select placeholder='请选择角色'>
                                {
                                    roles.map(role => <Option value={role._id} key={role._id}>
                                        {role.name}
                                    </Option>)
                                }
                            </Select>   
                        )                                             
                    }
                </Item>
            </Form>
        )
    }
}

export default Form.create()(UserForm);