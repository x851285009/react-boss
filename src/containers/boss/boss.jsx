import React,{Component} from 'react';
import {connect} from 'react-redux';

import {getUserList} from '../../redux/actions';
import UserList from '../../components/user-list/user-list';

class Boss extends Component {
    componentDidMount() {
        this.props.getUserList('JobSeeker');
    }
    render () {
        return <UserList userList={this.props.userList}></UserList>
    }
}
export default connect(
    state => ({userList: state.userList}),
    {getUserList}
)(Boss)