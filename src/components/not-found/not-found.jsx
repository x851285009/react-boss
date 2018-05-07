import React,{Component} from 'react';
import {Button} from 'antd-mobile';

class NotFound extends Component {
    render () {
        return (
            <div>
                <h2>抱歉找不到该页面</h2>
                <Button type='primary' onClick={()=> this.props.history.replace("/")}>返回首页</Button>
            </div>
        )
    }
}
export default NotFound;