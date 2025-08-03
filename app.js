const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const memoRoutes = require('./routes/memos');
const { initDatabase } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件配置
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 路由配置
app.use('/api/memos', memoRoutes);

// 根路径
app.get('/', (req, res) => {
  res.json({
    code: 200,
    message: '备忘录API服务运行正常',
    data: {
      version: '1.0.0',
      endpoints: [
        'GET /api/memos - 获取备忘录列表',
        'GET /api/memos/:id - 获取备忘录详情',
        'POST /api/memos - 创建备忘录',
        'PUT /api/memos/:id - 更新备忘录',
        'DELETE /api/memos/:id - 删除备忘录'
      ]
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
