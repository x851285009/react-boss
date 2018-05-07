import React, {Component} from 'react';
import {
    NavBar,
    WingBlank,
    List,
    InputItem,
    WhiteSpace,
    Radio,
    Button,
    Toast
} from 'antd-mobile';
import {connect} from 'react-redux';
//重定向
import {Redirect} from 'react-router-dom';

import Logo from '../../components/logo/logo';
import {register} from '../../redux/actions'

class Register extends Component {
    //初始化数据
    state = {
        username:'',
        password:'',
        password2:'',
        type:'JobSeeker'
    }
    //处理输入框/单选框变化,收集数据到state
    handleChange = (name, value) => {
        this.setState({
            [name]: value
        })
    }
    //跳转到login路由
    toLogin = () => {
        this.props.history.replace('/login');
    }
    //注册
    register = () => {
        this.props.register(this.state);
        const timer = setTimeout(()=>{
            clearTimeout(timer);
            const {msg} = this.props.user;
            if(msg){
                Toast.fail(`${msg}`, 1);
                this.props.user.msg = null;
            }
        },50)
    }

    render () {
        // const {type} = this.state;
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
                        <InputItem placeholder='请输入用户名' onChange={val => this.handleChange('username', val)}>用户名:</InputItem>
                        <WhiteSpace/>
                        <InputItem type='password' placeholder='请输入密码' onChange={val => this.handleChange('password', val)}>密&nbsp;&nbsp;&nbsp;码:</InputItem>
                        <WhiteSpace/>
                        <InputItem type='password' placeholder='请确认密码' onChange={val => this.handleChange('password2', val)}>确认密码:</InputItem>
                        <WhiteSpace/>
                        <List.Item>
                            <span style={{marginRight: 30}}>用户类型:</span>
                            <Radio checked={this.state.type === 'JobSeeker'} onClick = {() => this.handleChange('type', 'JobSeeker')}>求职者</Radio>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <Radio checked={this.state.type === 'Boss'} onClick = {() => this.handleChange('type', 'Boss')}>Boss</Radio>
                        </List.Item>
                        <WhiteSpace/>
                        <Button  type='primary'  onClick={this.register}>注&nbsp;&nbsp;&nbsp;册</Button>
                        <WhiteSpace/>
                        <Button onClick={this.toLogin}>已有账号</Button>
                    </List>
                </WingBlank>
            </div>
        )
    }
} 
export default connect(
    state => ({user: state.user}),
    {register}
)(Register);