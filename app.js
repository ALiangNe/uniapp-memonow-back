const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const memoRoutes = require('./routes/memos');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const { initDatabase } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件配置
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 路由配置
app.use('/api/memos', memoRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// 根路径
app.get('/', (req, res) => {
  res.json({
    code: 200,
    message: '备忘录API服务运行正常',
    data: {
      version: '2.0.0',
      description: '支持多用户的备忘录API服务',
      features: [
        '✅ 用户身份识别与数据隔离',
        '✅ 微信小程序登录支持',
        '✅ 备忘录增删改查',
        '✅ 用户信息管理',
        '✅ 数据安全保护'
      ],
      endpoints: {
        auth: [
          'POST /api/auth/wechat-login - 微信小程序登录',
          'POST /api/auth/test-login - 测试登录'
        ],
        users: [
          'POST /api/users/register - 用户注册/更新',
          'GET /api/users/profile - 获取用户信息',
          'PUT /api/users/profile - 更新用户信息',
          'GET /api/users/stats - 获取用户统计'
        ],
        memos: [
          'GET /api/memos - 获取备忘录列表（需要User-Id）',
          'GET /api/memos/:id - 获取备忘录详情（需要User-Id）',
          'POST /api/memos - 创建备忘录（需要User-Id）',
          'PUT /api/memos/:id - 更新备忘录（需要User-Id）',
          'DELETE /api/memos/:id - 删除备忘录（需要User-Id）'
        ]
      },
      notice: '所有备忘录相关接口都需要在请求头中包含 User-Id 字段'
    }
  });
});

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({
    code: 404,
    message: '接口不存在',
    data: null
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({
    code: 500,
    message: '服务器内部错误',
    data: null
  });
});

// 启动服务器
async function startServer() {
  try {
    // 初始化数据库
    await initDatabase();
    console.log('数据库连接成功');
    
    app.listen(PORT, () => {
      console.log(`服务器运行在端口 ${PORT}`);
      console.log(`访问地址: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('启动服务器失败:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;
