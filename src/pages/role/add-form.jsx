import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
    Input,
    Form,
} from 'antd'

const Item = Form.Item
/**
 * 添加分类的组件
 */
class AddForm extends Component {
    static propTypes = {
        setForm:PropTypes.func.isRequired
    }
    componentWillMount() {
        // 将form对象通过setForm()传递父组件
        this.props.setForm(this.props.form);
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form >
                <Item label="角色名称" labelCol={{ span: 5}} wrapperCol={{ span: 18 }}>
                    {
                        getFieldDecorator('roleName', {
                            initialValue: '',
                            rules: [{ required: true, message: '角色名称不能为空!' }]                            
                        })(
                            <Input placeholder='请输入角色名称'></Input>
                        )
                    }
                </Item>
            </Form>
        )
    }
}
export default Form.create()(AddForm);