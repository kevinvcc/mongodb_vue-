// todo III. 监听端口号

const express = require('express');
const app = express();

// todo **** 引入接口 ****
const api = require('./api');
api(app);

app.listen(80);