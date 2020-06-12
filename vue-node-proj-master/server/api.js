// todo II. 所有接口
const db = require('./db');

module.exports = function (app) {
   // 匹配完整的路径
  app.all("*", function(req, res, next) {
    // console.log("req："+req+"res:"+res+"next:"+next);
    // res.writeHead(200, { "Content-Type": "text/plain", "Access-Control-Allow-Origin":"*" })
    // res.header('Access-Control-Allow-Origin', '*')
    // res.header('Access-Control-Allow-Headers', 'X-Requested-With')
    // res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
    // res.header("X-Powered-By",' 3.2.1')
    // res.header("Content-Type", "application/json;charset=utf-8")
    // next()
    // res.header('Access-Control-Allow-Origin', '*');
    // res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    // res.header("Access-Control-Allow-Methods","*");
    next();
    // if (req.method == 'OPTIONS') {
    //   res.send(200);
    // }
    // else {
    //   next();
    // }
  });

  // todo 1. api login
  app.get('/api/user/login', function (req, res) {
    // 对发来的登录数据进行验证
    if (!req.query.name) {
      // res.writeHead('Access-Control-Allow-Origin', '*');
      // res.writeHead('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild, x-access-token');
      // res.writeHead('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
      // res.writeHead('Access-Control-Allow-Credentials', 'true');
      res.json({code: 600, msg:'name 不能为空！'})
      return
    }
    if (!req.query.pwd) {
      res.json({code: 600, msg:'pwd 不能为空！'})
      return
    }
    db.userModel.findOne({name: req.query.name}, function(err, doc){
      if (err) {
        console.log('查询出错：' + err);
        res.json({code: 700, msg:'查询出错：' + err})
        return
      } else {
        if (!doc) {
          res.json({code: 700, msg:'不存在该用户名：' + req.query.name})
          return
        } else {
          if (req.query.pwd != doc.pwd) {
            res.json({code: 700, msg:'密码不正确！'})
            return
          } else {
            res.json({code: 200, msg:'密码正确，登录成功'})
            return
          }
        }

      }
    })
  })

  // todo 2.api register
  app.get('/api/user/register', function (req, res) {
    // 对发来的注册数据进行验证
    let name = req.query.name
    let pwd = req.query.pwd
    if (!name) {
      res.json({code: 600, msg:'name 不能为空！'})
      return
    }
    if (!pwd) {
      res.json({code: 600, msg:'pwd 不能为空！'})
      return
    }
    // 查询数据库验证注册账号、密码
    // 是否存在账号
    db.userModel.findOne({name: req.query.name}, function(err, doc){
      if (err) {
        console.log('查询出错：' + err);
        res.json({code: 700, msg:'查询出错：' + err})
        return
      } else {
        if (doc) {
          res.json({code: 700, msg:'该用户名名已经被注册：' + name})
          return
        } else {
          db.userModel.create({
            name: name,
            pwd: pwd
          }, function (err, doc) {
            if (err) {
              res.end('注册失败:' + err)
            } else {
              res.json({code: 200, msg:'用户注册成功：' + name})
              return
            }
          })
        }

      }
    })
    // 返回注册状态
    // res.send(JSON.stringify({code: 200, data: {account: 'guojcres', pass: 111111}}))
  })

  // todo 3. api index
  app.get('/api/goods/index', function (req, res) {
    let temai = [],
        rexiao = [],
        jingpin = [];

      /**
       *  promise 解决
       *  model.find(Conditions,fields,options,callback(err, doc));
       *    Conditions: 查询条件
            fields: 返回的字段
            options: 游标（sort,limit）
            callback: 回调函数，参数doc为查询出来的结果
       *
       */
    // 3.1 temai 特卖
      const getTemai = new Promise((resolve,reject) => {
      db.goodsModel.find(
        {brand_status: "temai"},
        {brand_id:1, brand_name:1, brand_price:1, brand_pic:1, brand_status:1, _id:0},
        {limit: 3},
        function(err, doc){ // doc 为返回的结果
          if (err) {
            console.log('temai find error!');
            reject('reject temai')
          } else {
            if (!doc) { // 结果为空时
              temai = [];
            } else {  // 结果部为空时
              temai = doc;
              console.log("****** 查询热卖的时间："+new Date().toLocaleTimeString());
            }
            resolve(temai); // resolve 有结果的返回
          }
        })
    });

    // 3.2 rexiao 热销
    const getRexiao = new Promise((resolve,reject) => {
      db.goodsModel.find(
        {brand_status: "rexiao"},
        {brand_id:1, brand_name:1, brand_desc:1, brand_pic:1, brand_status:1, _id:0},
        {limit: 3},
        function(err, doc){
          if (err) {
            console.log('rexiao find error!');
            reject('reject rexiao')
          } else {
            if (!doc) {
              rexiao = [];
            } else {
              rexiao = doc;
              console.log("****** 查询热销的时间："+new Date().toLocaleTimeString());
            }
            resolve(rexiao)
          }
        })
    });

    // 3.3 jingpin 精品
    const getJingpin = new Promise((resolve,reject) => {
      db.goodsModel.find(
        {brand_status: "jingpin"},
        {brand_id:1, brand_name:1, brand_price:1, brand_pic:1, brand_status:1, _id:0},
        {limit: 4},
        function(err, doc){
          if (err) {
            console.log('jingpin find error!');
            reject('reject jingpin')
          } else {
            if (!doc) {
              jingpin = []
            } else {
              jingpin = doc;
              console.log("****** 查询精品的时间："+new Date().toLocaleTimeString());
            }
            resolve(jingpin)
          }
        })
    });

    // 3.4 *处理多个异步处理,如：一个页面上需要等两个或多个ajax的数据回来以后才正常显示
    const p_all = Promise.all([getTemai, getRexiao, getJingpin]);

    p_all.then( (suc) => {
      let data = {
        "temai": suc[0],
        "rexiao": suc[1],
        "jingpin": suc[2]
      };

      // 3.5 返回结果的处理,response 返回给前端
      res.json({code: 200, msg:'', data: data});
      return ;
    }).catch( (err) => {
      console.log('err all:' + err);
      res.json({code: 600, msg:'查询出错', data: data});
      return ;
    })
  });

  // todo 4. 精品下拉加载更多api index/jingpin
  app.get('/api/goods/index/jingpin', function (req, res) {
    let nowLength = parseInt(req.query.nowLength);
    // skip(m)方法来跳过指定数量的数据, 跳过limit的数据，返回limit后面的m条数据
    db.goodsModel.find(
      {brand_status: "jingpin"},
      {brand_id: 1, brand_name: 1, brand_price: 1, brand_pic: 1, _id: 0},
      {limit: 4, skip:nowLength},
      function (err, doc) {
        if (err) {
          console.log('jingpin find error!');
          console.log(err);
        } else {
          if (!doc) {
            // res
            res.json({code: 600, msg: '没有了', data: ''});
            return;
          } else {
            // res 加载效果，故意延时1s
            setTimeout( ()=> {
              res.json({code: 200, msg: '', data: doc});
                console.log('精品下拉加载更多产品....!'+new Date().toLocaleTimeString());
                return
            }, 800)
          }
        }
      }
    )
  });

  // todo 5. api cate  商品列表页
  app.get('/api/goods/cate', function (req, res) {
    db.goodsModel.find({}, function(err, doc){
      if (err) {
        console.log('查询出错：' + err);
        res.json({code: 700, msg:'查询出错：' + err})
        return
      } else {
        if (!doc) {
          res.json({code: 600, msg:'没有商品', data: doc});
          return
        } else {
          res.json({code: 200, msg:'', data: doc});
            console.log('获取产品时间：'+new Date().toLocaleTimeString());
            return
        }
      }
    })
  });

  // todo 6. api detail 商品详情页
  app.get('/api/goods/detail', function (req, res) {
    console.log("当前产品的id："+req.query.brand_id);
    let brand_id = req.query.brand_id; // 与 前端/api/goods/detail 中params的参数id保持一致
    db.goodsModel.findOne({brand_id: brand_id}, {__v: 0, _id: 0}, function(err, doc){
      if (err) {
        console.log('查询出错：' + err);
        res.json({code: 700, msg:'查询出错：' + err});
        return
      } else {
        if (!doc) {
          res.json({code: 600, msg:'没有商品', data: doc});
          return
        } else {
          res.json({code: 200, msg:'', data: doc});
          console.log('查询产品详情信息的时间：   '+new Date().toLocaleTimeString());
            return
        }
      }
    })
  });

  // todo 7.api addToCart
  app.get('/api/goods/addToCart', function (req, res) {
    let brand_id = req.query.brand_id;
    let name = req.query.name;
    let newCart = req.query;
    // model.update(查询条件,更新对象,callback)
    db.cartsModel.update({brand_id: brand_id, name: name}, {$set:newCart}, {upsert:true}, function(err){
        if (err) {
          console.log('加入购物车失败：' + err);
          res.json({code: 700, msg:'加入购物车失败：' + err});
          return
        } else {
          // add
          res.json({code: 200, msg:'加入购物车成功'});
          console.log('加入购物车成功！');
            return
        }
    })
  });

  // todo 8. api carts
  app.get('/api/goods/carts', function (req, res) {
    let name = req.query.name
    db.cartsModel.find({name: name}, {__v: 0, _id: 0}, function(err, doc){
      if (err) {
        console.log('购物车查询出错：' + err);
        res.json({code: 700, msg:'购物车查询出错：' + err});
        return
      } else {
        if (!doc) {
          res.json({code: 600, msg:'购物车为空', data: doc});
          return
        } else {
          res.json({code: 200, msg:'购物车返回成功', data: doc});
          console.log('购物车返回成功');
            return
        }
      }
    })
  });

  // todo 9.api delectCart
  app.get('/api/goods/delectCart', function (req, res) {
    let brand_id = req.query.brand_id;
    let name = req.query.name;
    db.cartsModel.remove({brand_id: brand_id, name: name}, function(err){
      if (err) {
        console.log('购物车删除：' + err);
        res.json({code: 700, msg:'购物车删除：' + err});
        return
      } else {
        // add
        res.json({code: 200, msg:'购物车删除成功'});
        console.log('购物车删除成功');
        return
      }
    })
  });

  app.get('*', function(req, res){
    res.end('404')
  })
};
