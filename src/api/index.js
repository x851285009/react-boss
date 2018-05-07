//包含多个接口请求函数的模块
//每个函数返回的都是Promise对象
//login:user:{username, password}
//register:user:{username, password, type}
import ajax from './ajax';
//注册接口
export const reqRegister = (user) => ajax('/register', user, 'POST');
//登录接口
export const reqLogin = (user) => ajax('/login', user, 'POST');
//用户更新接口
export const reqUpdateUser = (user) => ajax('/update', user, 'POST');
// 获取用户信息
export const reqUser = () => ajax('/user');
//获取对应用户列表
export const reqUserList = (type) => ajax('/userlist', {type});
//请求获取当前用户所有的聊天列表
export const reqChatMsgList = () => ajax('/msglist');
//请求修改指定消息为已读
export const reqReadMag = (from) => ajax('/readmsg', {from}, 'POST');