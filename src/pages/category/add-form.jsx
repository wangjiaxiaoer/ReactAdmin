import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
    Input,
    Select,
    Form,
} from 'antd'

const Item = Form.Item
const Option = Select.Option
/**
 * 添加分类的组件
 */
class AddForm extends Component {
    static propTypes = {
        categorys: PropTypes.array.isRequired,
        parentId:PropTypes.string.isRequired,
        setForm:PropTypes.func.isRequired
    }

    componentWillMount() {
        // 将form对象通过setForm()传递父组件
        this.props.setForm(this.props.form);
    }

    render() {
        const { categorys, parentId } = this.props;
        const { getFieldDecorator } = this.props.form;
        return (
            <Form>
                <Item>
                    {
                        getFieldDecorator('parentId', {
                            initialValue: parentId
                        })(
                            <Select>
                                <Option value='0' d>一级分类</Option>
                                {
                                    categorys.map(c => <Option value={c._id} key={c._id}>{c.name}</Option>)
                                }
                            </Select>
                        )
                    }
                </Item>
                <Item>
                    {
                        getFieldDecorator('categoryName', {
                            initialValue: '',
                            rules: [{ required: true, message: '分类名称不能为空!' }]                            
                        })(
                            <Input placeholder='请输入分类名称'></Input>
                        )
                    }
                </Item>
            </Form>
        )
    }
}

export default Form.create()(AddForm);