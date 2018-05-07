import React, {Component} from 'react';
import {
    NavBar,
    WingBlank,
    List,
    InputItem,
    WhiteSpace,
    Button,
    Toast
} from 'antd-mobile';
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'

import Logo from '../../components/logo/logo';
import {login} from '../../redux/actions'

class Login extends Component {
    state = {
        username:'',
        password:''
    }
    //[name]此时name是一个变量而不是属性了
    handleChange = (name, value) => {
        this.setState({
            [name]: value
        })
    }
    // componentDidUpdate () {
       
    //     const timer = setTimeout(() => {
    //         clearTimeout(timer);
    //         if(msg){
    //             Toast.fail(`${msg}`, 1);
    //         }
    //     },50);
    // }
    toRegister = () => {
        this.props.history.replace('/register');
    }
    login = () => {
        this.props.login(this.state);
        const timer = setTimeout(()=>{
            clearTimeout(timer);
            const {msg} = this.props.user;
            if(msg){
                Toast.fail(`${msg}`, 1);
                this.props.user.msg = null;
            }
        },400)
    }
    render () {
        const {redirectTo} = this.props.user;
        if(redirectTo){
            return <Redirect to={redirectTo}/>
        }
        return (
            <div>
                <NavBar>友羽招聘</NavBar>
                <Logo/>
                <WingBlank>
                    <List>
                        <WhiteSpace/>
                        <InputItem placeholder='输入用户名'  onChange={val => {this.handleChange('username', val)}}>用户名:</InputItem>
                        <WhiteSpace/>
                        <InputItem type='password' placeholder='输入密码'  onChange={val => {this.handleChange('password', val)}}>密&nbsp;&nbsp;&nbsp;码:</InputItem>
                        <WhiteSpace/>
                        <Button type='primary' onClick={this.login}>登&nbsp;&nbsp;&nbsp;陆</Button>
                        <WhiteSpace/>
                        <Button onClick={this.toRegister}>还没有账号</Button>
                    </List>
                </WingBlank>
            </div>
        )
    }
} 
export default connect(
    state => ({user: state.user}),
    {login}
)(Login);