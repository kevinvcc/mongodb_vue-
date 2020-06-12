// todo I. mongodb 连接

// todo 1. mongodb 连接数据库
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const database = mongoose.connect('mongodb://127.0.0.1:27017/nodeVue');

// todo 2. 连接状态检验
database.connection.on('error', function(error){
  console.log('数据库nodeVue连接失败：' + error);
  return
});
database.connection.once('open', function(){
  console.log('数据库nodeVue连接成功');
  // callback()
});

// const init = function (callback) {
//   // const mongoose = require('mongoose')
//   database = mongoose.connect('mongodb://127.0.0.1:27017/test_nodeVue')
//   database.connection.on('error', function(error){
//     console.log('数据库test_nodeVue连接失败：' + error)
//     // return
//   })
//   database.connection.on('open', function(){
//     console.log('数据库test_nodeVue连接成功')
//     callback()
//   })
// }

// todo 3. 创建集合结构对象
const userSchema = new Schema({
  name: {type: String},
  pwd: {type: String},
  time: {type: Date, default: Date.now}
});

// todo 4. 关联集合文本对象,即与表一一对应
const db = {
  // init: init,
  userModel: database.model('userModel', userSchema)
};

// todo 5. 导出
module.exports = db;
