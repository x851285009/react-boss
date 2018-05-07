//引入socket
import io from 'socket.io-client';
//包含所有action creator函数的模块
import {
    AUTH_SUCCESS, 
    ERROR_MSG,
    RECEIVE_USER,
    RESET_USER,
    RECEIVE_USER_LIST,
    RECEIVE_MSG_LIST,
    RECEIVE_MSG,
    MSG_READ
} from './action-types';
import {
    reqLogin,
    reqRegister,
    reqUpdateUser,
    reqUser,
    reqUserList,
    reqChatMsgList,
    reqReadMag
} from '../api';




//同步错误消息
const errorMsg = (msg) => ({type: ERROR_MSG, data: msg});
//同步成功响应
const authSuccess = (user) => ({type: AUTH_SUCCESS, data: user});
// 接收用户的同步action
const receiveUser = (user) => ({type: RECEIVE_USER, data:user});
// 重置用户的同步action
export const resetUser = (msg) => ({type: RESET_USER, data: msg});
//接收用户列表的同步action
const receiveUserList = (users) => ({type: RECEIVE_USER_LIST, data: users});
// 接收消息列表的同步action
const receiveMsgList = ({users, chatMsgs, userid}) => ({type: RECEIVE_MSG_LIST, data: {users, chatMsgs, userid}});
// 接收一个消息的同步action
const receiveMsg = (chatMsg, userid) => ({type: RECEIVE_MSG, data: {chatMsg, userid}});
//读取了某个聊天会话的同步action
const msgRead =({count, from, to}) => ({type: MSG_READ, data: {count, from, to}});

/*
单例对象
1. 创建对象之前: 判断对象是否已经存在, 只有不存在才去创建
2. 创建对象之后: 保存对象
 */
//初始化通信对象
function initIO(dispatch, userid){
    // 1. 创建对象之前: 判断对象是否已经存在, 只有不存在才去创建
    if(!io.socket) {
        // 连接服务器, 得到与服务器的连接对象
        io.socket = io('ws://localhost:4000');// 2. 创建对象之后: 保存对象
        // 绑定监听, 接收服务器发送的消息
        io.socket.on('receiveMsg', function(chatMsg){
            // 只有当chatMsg是与当前用户相关的消息, 才去分发同步action保存消息
            if(userid === chatMsg.from || userid === chatMsg.to){
                dispatch(receiveMsg(chatMsg, userid));
            }
        })
    }
}
//异步获取消息列表
async function getMsgList(dispatch, userid){
    initIO(dispatch, userid);
    const response = await reqChatMsgList();
    const result = response.data;
    if(result.code === 0){
        const {users, chatMsgs} = result.data;
        //分发同步action
        dispatch(receiveMsgList({users, chatMsgs, userid}));
    }
}
// 发 送注册的异步ajax请求未使用 async的情况
/*const promise = reqRegister(user)
promise.then(response => {
const result = response.data  // {code: 0/1, data: user, msg: ''}
})*/
//异步注册actions
export const register = (user) => {
 
    const {username, password, password2, type} = user;
    if(!username) {
        return errorMsg('用户名不能为空')
    } else if (password !== password2){
        return errorMsg('两次密码不一致')
    } else if (password === '' ){
        return errorMsg('密码不能为空')
    }
    return async dispatch => {
        const response = await reqRegister({username, password, type});//不需要password2
        const result = response.data;
        if(result.code === 0) {//成功
            //获取消息列表
            getMsgList(dispatch, result.data._id);
            //分发成功的action
            dispatch(authSuccess(result.data))
        } else {//失败
            //分发失败的action
            dispatch(errorMsg(result.msg))
        }
    }
}
//异步登录actions
export const login = (user) => {
    const {username, password} = user;
    if(!username) {
        return errorMsg('用户名不能为空');
    } else if(!password){
        return errorMsg('密码不能为空');
    }
    return async dispatch => {
        const response = await reqLogin(user);
        const result = response.data;//{code: 0/1,data: user, msg}
        if(result.code === 0) {//成功
            //获取消息列表
            getMsgList(dispatch, result.data._id);
            //分发成功的action
            dispatch(authSuccess(result.data))
        } else {//失败
            //分发失败的action
            dispatch(errorMsg(result.msg))
        }
    }
}
//异步更新的actions
export const updateUser = (user) => {
    return async dispatch => {
        const response = await reqUpdateUser(user);
        const result = response.data;
        if(result.code=== 0){//更新成功:data
            dispatch(receiveUser(result.data));
        } else {
            dispatch(resetUser(result.msg)); //失败重置用户信息
        }
    }
}
//异步获取用户的actions
export const getUser = () => {
    return async dispatch => {
        const response = await reqUser()
        const result = response.data
        if (result.code === 0) {
            //获取消息列表
            getMsgList(dispatch, result.data._id);
            dispatch(receiveUser(result.data))
        } else {
            dispatch(resetUser(result.msg))
        }
    }
}
//异步获取用户列表
export const getUserList = (type) => {
    return async dispatch => {
        const response = await reqUserList(type);
        const result = response.data;
        if(result.code === 0) {
            dispatch(receiveUserList(result.data));
        }
    }
}
//发送消息的异步action
export const sendMsg = ({from, to, content}) => {
    return dispatch => {
        console.log('客户端向服务器发送消息', {from, to, content});
        io.socket.emit('sendMsg', {from, to, content});
    }
}
//读取消息的异步action
export const readMsg = (from, to) => {
    return async dispatch => {
        const response = await reqReadMag(from);
        const result = response.data;
        if(result.code === 0){
            const count = result.data;
            dispatch(msgRead({count, from, to}))
        } 
    }
}
