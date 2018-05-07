/*
用户列表的UI组件
*/
import React, {Component} from 'react';
import {Card, WingBlank, WhiteSpace} from 'antd-mobile';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import QueueAnim from 'rc-queue-anim';
const Header = Card.Header;
const Body = Card.Body;

class UserList extends Component {
    static propTypes = {
        userList: PropTypes.array.isRequired
    }

    render () {
        return (
            <WingBlank style={{marginBottom:60, marginTop:50}}>
            <QueueAnim type='scale' delay={100}>
                {
                    this.props.userList.map(user =>(
                        <div key={user._id}>
                            <WhiteSpace/>
                            <Card onClick={() => this.props.history.push(`/chat/${user._id}`)}>
                            <Header
                                thumb={user.header ? require(`../../assets/images/${user.header}.png`) : null}
                                extra={user.username}
                            />
                            <Body>
                                <div>职位:{user.post}</div>
                                {user.company ? <div>公司: {user.company}</div> : null} 
                                {user.salary ? <div>公司: {user.salary}</div> : null}
                                <div>描述: {user.info}</div>
                            </Body>
                            </Card>
                        </div>
                    ))
                }
                </QueueAnim>
            </WingBlank>
        )
    }
}
export default withRouter(UserList);