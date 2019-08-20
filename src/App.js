import React,{Component} from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

// import { Button,message } from 'antd'

import Login from './pages/login/login'
import Admin from './pages/admin/admin'


class App extends Component {

    // handleClick = () => {
    //     message.success('成功啦')
    // }
    render() {
        return (
            // {/* <Button type="primary" onClick={()=>this.handleClick()}>跳转</Button> */}
            <BrowserRouter>
                <Switch>
                    <Route path='/login' component={Login}></Route>
                    <Route path='/' component={Admin}></Route>
                </Switch>
            </BrowserRouter>
            
        )
    }
}

export default App;


// axios bizcharts araft-js echarts echarts-for-react html-to-draftjs jsonp prop-types @anty/data-set redux redux-devtools-extension redux-thunk store react-draft-wysiwyg react-redux 