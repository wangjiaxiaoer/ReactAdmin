import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import {
    Form,
    Icon,
    Button,
    Input,
    message
} from 'antd';
import './login.less'
import logo from '../../assets/images/login_logo.png'
import { reqLogin } from '../../api/'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils  from '../../utils/storageUtils'
/**
 * Login路由
 */
class Login extends Component {
    // 提交事件
    handleSubmit = (event) => {
        // 阻止默认行为
        event.preventDefault();
        // 得到form对象
        const form = this.props.form;
        // 获取表单项的数据
        // const values = form.getFieldsValue();
        // 对所有的表单字段进行验证
        form.validateFields(async (err, values) => {
            if (!err) {
                // console.log('提交ajax');
                const { username, password } = values;
                const result = await reqLogin(username, password)
                if (result.status === 0) {
                    message.success("登录成功");
                    // 保存user
                    const user = result.data;
                    // 保存在内存中
                    memoryUtils.user = user;
                    // 保存到浏览器缓存中
                    storageUtils.saveUser(user);
                    // 跳转到管理界面(不需要再回退登录页面，用replace)
                    this.props.history.replace('/')
                } else {
                    message.error(result.msg)
                }                               
            } else {
                console.log('校验失败~');
            }
        });
    }
    // 验证密码
    validatePwd = (rule, value, callback) => {
        if (!value) {
            callback("密码不能为空！") // 验证失败，并指定提示的文本
        } else if (value.length < 4) {
            callback("密码长度不能少于4位")
        } else if (value.length > 12) {
            callback("密码长度不能大于12位")
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            callback("密码必须是英文、数字和下划线组成")
        } else {
            callback()
        }
    }
    render() {
        // 如果用户已经登录，自动跳转到管理界面
        const user = memoryUtils.user
        if (user && user._id) {
            return <Redirect to="/"></Redirect>
        }
        // 得到具有强大功能的form对象
        const form = this.props.form;
        const { getFieldDecorator } = form;
        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo" />
                </header>
                <section className="login-content">
                    <h2>Welcome to login geas</h2>
                    <Form layout="inline" onSubmit={this.handleSubmit}>
                        <Form.Item>
                            {
                                getFieldDecorator('username', {
                                    // 配置对象：属性名是特定的一些名称
                                    // 声明式验证：直接使用别人定义好的验证规则进行验证
                                    rules: [
                                        { required: true, message: "用户名必须输入!" },
                                        { min: 4, message: "用户名至少4位!" },
                                        { max: 12, message: "用户名至多4位!" },
                                        { pattern: /^[a-zA-Z0-9_]+$/, message: "用户名必须是英文、数字和下划线组成!" },
                                    ],
                                    // 指定初始值
                                    initialValue: 'admin'
                                })(
                                    <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
                                )
                            }
                        </Form.Item>
                        <Form.Item>
                            {
                                getFieldDecorator('password', {
                                    rules: [
                                        { validator: this.validatePwd }
                                    ]
                                })(
                                    <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" laceholder="Password"
                                    />
                                )
                            }
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" >
                                登 录
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }
}

const WrapLogin = Form.create()(Login);

export default WrapLogin;
/**
 * 1、高阶函数
 *      1)一类特别函数
 *          接受函数类型的参数
 *          返回值是函数
 *      2)常见高阶函数
 *          a.定时器：setTimeOut()/setInterval()
 *          b.Promise
 *          c.数组遍历相关方法：forEach()/filter()/map()/reduce()/find()/findIndex()
 *          d.函数对象的bind()
 *          e.Form.create()()/getFieldDecorator()()
 *      3)高阶函数更新动态，更加具有拓展性
 * 2、高阶组件
 *      1)本质就是一个函数
 *      2)接收一个组件（被包装组件），返回一个新的组件(包装组件)，包装组件会向被包装组件传入特定属性
 *      3)作用：扩展组件的功能
 *      4)高阶组件也是高阶函数：接受一个组件函数，返回的是一个新的组件函数
 * 包装form组件生成一个新的组件，Form(Login)
 * 新的组件会向Form组件传递一个强大的对象属性：form
 */


 /**
  * async 和 await
  * 作用：
  *     简化promise对象的使用：不用再使用.then()来指定成功/失败的回调函数
  *     以同步编码(没有回调函数)方式实现异步流程
  * 哪里写await
  *     在返回promise的表达式左侧写await：不想要promise，想要promise异步执行的成功value数据
  * async
  *     await 所在函数(最近的)定义的左侧写async
  */