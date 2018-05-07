/*
使用mongoose操作mongodb的测试文件
1. 连接数据库
  1.1. 引入mongoose
  1.2. 连接指定数据库(URL只有数据库是变化的)
  1.3. 获取连接对象
  1.4. 绑定连接完成的监听(用来提示连接成功)
2. 得到对应特定集合的Model
  2.1. 字义Schema(描述文档结构)
  2.2. 定义Model(与集合对应, 可以操作集合)
3. 通过Model或其实例对集合数据进行CRUD操作
  3.1. 通过Model实例的save()添加数据
  3.2. 通过Model的find()/findOne()查询多个或一个数据
  3.3. 通过Model的findByIdAndUpdate()更新某个数据
  3.4. 通过Model的remove()删除匹配的数据
 */
const md5 = require('blueimp-md5');
// 1. 连接数据库
// 1.1. 引入mongoose
const mongoose = require('mongoose');
//1.2. 连接指定数据库(URL只有数据库是变化的)
mongoose.connect('mongodb://localhost:27017/boss_test');
//1.3. 获取连接对象
const conn = mongoose.connection;
conn.on('connected', function () {
    console.log('数据库连接成功了')
});
//2.1. 字义Schema(描述文档结构)
const userSchema = mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    type: {type: String, required: true}
});
//2.2. 定义Model(与集合对应, 可以操作集合)
const UserModel = mongoose.model('user', userSchema);

// 3.1. 通过Model实例的save()添加数据
function testSave() {
    const userModel1 = new UserModel({
        username: '张三',
        password: md5('123'),
        type: 'JobSeeker'
    });
    userModel1.save(function (error, user) {
        console.log('save', error, user);
    });
}

// testSave();
//3.2. 通过Model的find()/findOne()查询多个或一个数据
function testFind() {
    UserModel.find(function (err, users) {
        console.log('find', err, users);
    });
    UserModel.findOne({_id:'5ae3df230602482500394add'}, function (error, user) {
        console.log('findOne', error, user);0
    })
}
// testFind();
//3.3. 通过Model的findByIdAndUpdate()更新某个数据
function testUpdate() {
    // UserModel.findByIdAndUpdate({_id:'5ae3df230602482500394add'}, {username: '老王'}, function (err, user) {
    //     console.log('update', err, user);
    // })
    UserModel.findByIdAndUpdate({_id: '5ae3df230602482500394adc'}, {username: '李四'}, function (err, user) {
        console.log('update', err, user);//user代表旧的数据
    })
}
// testUpdate();
// 3.4. 通过Model的remove()删除匹配的数据
function testRemove() {
    UserModel.remove({_id: '5ae3df230602482500394add'}, function (err, result) {
        console.log('remove', err, result);//err(ok:0->失败 1->成功) result(n:xxx代表个数)
    })
}
testRemove();