const express = require('express');
const router = express.Router();
const {UserModel, ChatModel} = require('../db/models');
const md5 = require('blueimp-md5');
//返回值内要过滤掉的属性
const filter = {password: 0, __v: 0};
//注册路由
router.post('/register', function (req, res) {
    const {username, password, type} = req.body;
    UserModel.findOne({username}, function (err, user) {
        if(user) {
            res.send({code: 1, mag: '用户名已存在'});
        } else {
            new UserModel({username, type, password:md5(password)}).save(function (err, user) {
                res.cookie('userid', user._id, {maxAge: 1000*60*60*24*7});
                res.send({code: 0, data: {_id: user._id, username, type}});
            })
        }
    })
});

//登录路由
router.post('/login', function (req, res) {
    const {username, password} = req.body;
    UserModel.findOne({username, password: md5(password)}, filter, function (err, user) {
        if(!user){
            res.send({code: 1, msg: '用户名或密码错误'});
        } else {
            res.cookie('userid', user._id, {maxAge: 1000*60*60*24*7});
            res.send({code: 0, data: user})
        }
    })
});

router.post('/update', function (req, res) {
    // 得到请求cookie的userid
    const userid = req.cookies.userid
    if(!userid) {// 如果没有, 说明没有登陆, 直接返回提示
        return res.send({code: 1, msg: '请先登陆'}) 
    }
    // 更新数据库中对应的数据
    const user = req.body;
    UserModel.findByIdAndUpdate({_id: userid}, req.body, function (err, oldUser) {// user是数据库中原来的数据
        if(!oldUser) {
            // 通知浏览器删除userid cookie
            res.clearCookie('userid')
            // 返回返回一个提示信息
            res.send({code: 1, msg: '请先登陆'})
        } else {
            // 准备一个返回的user数据对象
            const {_id, username, type} = oldUser
            const data = Object.assign({_id, username, type}, user)
            // 返回
            res.send({code: 0, data})
        }
    })
})

// 根据cookie获取对应的user
router.get('/user', function (req, res) {
    // 取出cookie中的userid
    const userid = req.cookies.userid
    if(!userid) {
      return res.send({code: 1, msg: '请先登陆'})
    }
    // 查询对应的user
    UserModel.findOne({_id: userid}, filter, function (err, user) {
      return res.send({code: 0, data: user})
    })
})
//根据用户类型查询相应的列表
router.get('/userlist', function(req, res){
    const {type} = req.query;
    UserModel.find({type}, function(err, users){
        return res.json({code:0, data: users})
    })
})
/*
获取当前用户所有相关聊天信息列表
 */
router.get('/msglist', function(req, res){
    //获取cookie中的userid
    const userid = req.cookies.userid;
    // 查询得到所有user文档数组
    UserModel.find(function(err, userDocs){
         // 用对象存储所有user信息: key为user的_id, val为name和header组成的user对象
        const users = userDocs.reduce((users, user) => {
            users[user._id] = {username: user.username, header: user.header};
            return users;
        }, {})
        /*
        查询userid相关的所有聊天信息
        参数1: 查询条件
        参数2: 过滤条件
        参数3: 回调函数
        */
        ChatModel.find({'$or': [{from: userid}, {to: userid}]}, filter, function (err, chatMsgs) {
            // 返回包含所有用户和当前用户相关的所有聊天消息的数据
            
            res.send({code: 0, data: {users, chatMsgs}})
        })
    })

})
/*
修改指定消息为已读
 */
router.post('/readmsg', function(req, res){
    // 得到请求中的from和to
    const from = req.body.from;
    const to = req.cookies.userid;
    /*
    更新数据库中的chat数据
    参数1: 查询条件
    参数2: 更新为指定的数据对象
    参数3: 是否1次更新多条, 默认只更新一条
    参数4: 更新完成的回调函数
    */
    //如果multi=true，则修改所有符合条件的行，否则只修改第一条符合条件的行。
    ChatModel.update({from, to, read: false}, {read: true}, {multi: true}, function(err, doc){
        res.send({code: 0, data: doc.nModified}) // 更新的数量
    })
})


module.exports = router;
