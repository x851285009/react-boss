import React,{Component} from 'react';
import {connect} from 'react-redux';

import {getUserList} from '../../redux/actions';
import UserList from '../../components/user-list/user-list';

class JobSeeker extends Component {
    componentDidMount() {
        this.props.getUserList('Boss');
    }
    render () {
        return <UserList userList={this.props.userList}></UserList>
    }
}
export default connect(
    state => ({userList: state.userList}),
    {getUserList}
)(JobSeeker)