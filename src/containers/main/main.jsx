import React, {Component} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import Cookies from 'js-cookie'  // 可以操作前端cookie的对象 set()/get()/remove()
import {NavBar} from 'antd-mobile';

import BossInfo from '../boss-info/boss-info';
import JobSeekerInfo from '../jobseeker-info/jobseeker-info';
import Boss from '../boss/boss';
import JobSeeker from '../jobseeker/jobseeker';
import Message from '../message/message'
import User from '../user/user';
import NotFound from '../../components/not-found/not-found';
import NavFooter from '../../components/nav-footer/nav-footer';
import Chat from '../chat/chat';

import {getRedirectTo} from '../../utils/index';
import {getUser} from '../../redux/actions';
class Main extends Component {

    navList = [ // 包含所有导航组件的相关信息数据
        {
          path: '/boss', // 路由路径
          component: Boss,
          title: '求职者列表',
          icon: 'jobseeker',
          text: '求职者',
        },
        {
          path: '/jobseeker', // 路由路径
          component: JobSeeker,
          title: 'Boss列表',
          icon: 'boss',
          text: 'boss',
        },
        {
          path: '/message', // 路由路径
          component: Message,
          title: '消息列表',
          icon: 'message',
          text: '消息',
        },
        {
          path: '/user', // 路由路径
          component: User,
          title: '用户中心',
          icon: 'user',
          text: '个人',
        }
    ]
    componentDidMount () {
        //登陆过(cookie中有userid), 但没有登陆(redux管理的user中没有_id) 发请求获取对应的user
        const userid = Cookies.get('userid')
        const {_id} = this.props.user
        if(userid && !_id) {
            // 发送异步请求, 获取user
            // console.log('发送ajax请求获取user')
            this.props.getUser()
        }
    }
    render () {
         // 读取cookie中的userid
        let userid = Cookies.get('userid')
        // 如果没有, 自动重定向到登陆界面
        if(!userid) {
            return <Redirect to='/login'/>
        }
        const {user, unReadCount} = this.props;
        if(!user._id){
            return null
        } else {
            // 如果有_id, 显示对应的界面
            // 如果请求根路径, 根据user的type和header来计算出一个重定向的路由路径, 并自动重定向
            let path = this.props.location.pathname
            if(path==='/') {
                // 得到一个重定向的路由路径
                path = getRedirectTo(user.type, user.header)
                return <Redirect to= {path}/>
            }
        }
        const {navList} = this;
        const path = this.props.location.pathname; //获取请求的路径
        const currentNav = navList.find(nav => nav.path === path); //获取当前nav可能不存在
        if(currentNav){
            //根据用户类型决定隐藏哪个路由
            if(user.type === 'Boss'){
                navList[1].hide = true;
            } else {
                navList[0].hide = true;
            }
        }
        return (
            <div>
                {currentNav ? <NavBar className='stick-top'>{currentNav.title}</NavBar> : null}
                <Switch>
                    {
                        navList.map((nav) => <Route path={nav.path} key={nav.text} component={nav.component}/>)
                    }
                    <Route path='/bossinfo' component={BossInfo}/>
                    <Route path='/jobseekerinfo' component={JobSeekerInfo}/>
                    <Route path='/chat/:userid' component={Chat}/>
                    <Route component={NotFound}/>
                </Switch>
                {currentNav ? <NavFooter navList={navList} unReadCount={unReadCount}/> : null}
            </div>
        )
    }
}
export default connect(
    state => ({user: state.user, unReadCount: state.chat.unReadCount}),
    {getUser}
)(Main)