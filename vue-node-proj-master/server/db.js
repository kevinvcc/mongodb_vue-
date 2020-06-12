// todo I. 数据库初始化、Schema数据模型

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const initGoods = require('./initGoods.json');
const initCarts = require('./initCarts.json');

// 用户信息的数据结构模型(表1)
const userSchema = new Schema({
  name: {type: String},
  pwd: {type: String},
  time: {type: Date, default: Date.now}  // 注册时间
});

// 商品的的数据结构模型(表2)
const goodsSchema = new Schema({
  brand_id: Number,
  brand_cate: String, // 商品分类
  brand_cateName: String,
  brand_status: String,
  brand_name: String,
  brand_price: Number,
  brand_desc: String,
  brand_pic: String
});

// 购物车的的数据结构模型(表3)
const cartsSchema = new Schema({
  name: String,
  brand_id: Number,
  brand_cate: String,
  brand_name: String,
  brand_price: Number,
  brand_desc: String,
  brand_pic: String,
  cart_num: Number, // 品购物车中的数量
  cart_isSelect: Boolean // 是否打钩选中状态
});

mongoose.Promise = global.Promise;
const database = mongoose.connect('mongodb://127.0.0.1:27017/test_nodeVue');


database.connection.on('error', function(error){
  console.log('数据库test_nodeVue连接失败：' + error);
  return
});
database.connection.once('open', function(){
  console.log('数据库test_nodeVue连接成功');
  // 初始化数据库
  initData();
});

const db = {
  userModel: database.model('userModel', userSchema),
  goodsModel: database.model('goodsModel', goodsSchema),
  cartsModel: database.model('cartsModel', cartsSchema)
};

const initData = function () {
  // todo 1. 初始化商品goods
    // 参数doc为查询出来的结果
  db.goodsModel.find({}, function(err, doc){
    if (err) {
      console.log('initData出错：' + err);
    } else if (!doc.length) {
      console.log('db goodsModel open first time');
      // 初始化数据，遍历插入；先打印出来看看
      initGoods.map(brand => {
        db.goodsModel.create(brand)
      });
      console.log(initGoods)

    } else {
      // console.log(doc);
      console.log('db open not first time');
    }
  });

  // todo 2. 为用户name: 15011760730初始化购物车内容
  db.cartsModel.find({}, function(err, doc){
    if (err) {
      console.log('initData出错：' + err);
    } else if (!doc.length) {
      console.log('db cartsModel open first time');
      // 初始化数据，遍历插入；先打印出来看看
      initCarts.map(brand => {
        db.cartsModel.create(brand)
      })
      // console.log(initCarts)

    } else {
      console.log('db open not first time');
    }
  })
}

module.exports = db
