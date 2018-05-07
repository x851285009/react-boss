import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom'
import {NavBar, InputItem, Button, List, TextareaItem} from 'antd-mobile';

import HeaderSelector from '../../components/header-selector/header-selector';
import {updateUser} from '../../redux/actions';

class JobSeekerInfo extends Component {
    state = {
        header: '', // 头像名称
        post: '', // 职位
        info: '', // 个人或职位简介
    }
    handleChange = (name, val) => {
        this.setState({
            [name]: val
        })
    }
    //更新header状态
    setHeader = (header) => {
        this.setState({
            header
        })
    }
    save = () =>{
        this.props.updateUser(this.state); 
    }

    render () {
        // 如果信息已经完善, 自动重定向到对应主界面
        const {header, type} = this.props.user
        if(header) { // 说明信息已经完善
            const path = type==='Boss' ? '/boss' : '/jobseeker'
            return <Redirect to={path}/>
        }
        return (
            <div>
                <NavBar>JobSeeker信息完善</NavBar>
                <HeaderSelector setHeader={this.setHeader} />
                <List>
                    <InputItem placeholder='请输入求职岗位' onChange={val => {this.handleChange('post', val)}}>求职岗位:</InputItem>          
                    <TextareaItem title='个人介绍'  placeholder='请输入个人介绍' rows={3} onChange={val => {this.handleChange('info', val)}}></TextareaItem>      
                    <Button type='primary' onClick={this.save}>保&nbsp;&nbsp;&nbsp;存</Button>
                </List>
            </div>
        )
    }
}
export default connect(
    state => ({user: state.user}),
    {updateUser}
)(JobSeekerInfo)