import React,{Component} from 'react';
import {Result, List, WhiteSpace, Button, Modal} from 'antd-mobile'; 
import {connect} from 'react-redux';
import Cookies from 'js-cookie';
import {resetUser} from '../../redux/actions';

const Item = List.Item;
const Brief = Item.Brief;

class User extends Component {
    logout = () => {
        Modal.alert('退出','确定退出登陆吗?',[
            {text: '取消'},
            {
                text: '确定',
                onPress: () => {
                    Cookies.remove('userid');
                    this.props.resetUser();
                }
            }
        ])
    }

    render () {
        const {username, info, header, company, post, salary} = this.props.user
        return (
            <div style={{marginTop: 50}}>
                <Result img={<img src={require(`../../assets/images/${header}.png`)} style={{width: 50}} alt='header'/>}
                    title={username}
                    message={company}
                />
                <List renderHeader={()=> '信息相关'}>
                    <Item multipleLine>
                        <Brief>职位: {post}</Brief>
                        <Brief>简介: {info}</Brief>
                        {salary ? <Brief>薪资: {salary}</Brief> : null}
                    </Item>
                </List>
                <WhiteSpace/>
                <List>
                    <Button type='warning' onClick={this.logout}>退出登录</Button>
                </List>
            </div>
        )
    }
}
export default connect(
    state => ({user: state.user}),
    {resetUser}
)(User)