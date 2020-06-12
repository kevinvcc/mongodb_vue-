// todo III. 后台服务启动入口

const express = require('express');
const app = express();

const api = require('./api');
api(app);

app.listen(8889);
