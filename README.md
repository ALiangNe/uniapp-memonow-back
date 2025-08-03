# 备忘录应用后端API

一个基于Node.js和Express框架开发的备忘录应用后端API服务，支持备忘录的增删改查功能。

## 🚀 功能特性

- ✅ 备忘录增删改查（CRUD）
- ✅ 自动时间管理（创建时间、更新时间）
- ✅ 数据验证和错误处理
- ✅ 统一的API响应格式
- ✅ MySQL数据库支持
- ✅ 跨域支持（CORS）

## 📋 API接口

| 方法 | 路径 | 功能 |
|------|------|------|
| GET | `/api/memos` | 获取备忘录列表 |
| GET | `/api/memos/:id` | 获取备忘录详情 |
| POST | `/api/memos` | 创建备忘录 |
| PUT | `/api/memos/:id` | 更新备忘录 |
| DELETE | `/api/memos/:id` | 删除备忘录 |

## 🛠️ 技术栈

- **Node.js** - 运行环境
- **Express** - Web框架
- **MySQL2** - 数据库驱动
- **CORS** - 跨域支持
- **Body-parser** - 请求体解析
- **Dotenv** - 环境变量管理

## 📦 快速开始

### 1. 克隆项目
```bash
git clone https://github.com/YOUR_USERNAME/memo-backend-api.git
cd memo-backend-api
```

### 2. 一键启动
```bash
chmod +x entrypoint.sh
./entrypoint.sh
```

这个脚本会自动：
- 安装所有依赖
- 启动API服务器
- 初始化数据库

### 3. 访问服务
- **本地访问**: http://localhost:3000
- **云服务器访问**: https://vgsarkerfnri.sealosbja.site
- **API接口**: `/api/memos`

## 🗄️ 数据库

项目使用MySQL数据库，启动时会自动创建数据库和表结构。

## 📖 文档

- [API接口对接文档](./api-md/API接口对接文档.md) - 完整的API文档
- [API快速参考](./api-md/API快速参考.md) - 快速开发参考
- [部署说明](./api-md/部署说明.md) - 详细部署指南
- [时间字段功能说明](./api-md/时间字段功能说明.md) - 时间字段详细说明
- [原始API文档](./api-md/备忘录应用后端API接口文档.md) - 原始需求文档

## 🌐 Devbox云开发

本项目在Devbox云开发环境中运行，提供：
- 预配置的Node.js环境
- MySQL数据库服务
- 自动化部署流程
- 外网访问支持

## 🧪 测试

### 自动化测试脚本
```bash
# 测试API接口
node test-script/test-api.js

# 测试时间字段功能
node test-script/test-time-fields.js

# 测试数据库连接
node test-script/test-db.js
```

### 手动测试
```bash
# 测试API接口
curl http://localhost:3000/api/memos

# 创建备忘录
curl -X POST http://localhost:3000/api/memos \
  -H "Content-Type: application/json" \
  -d '{"title":"测试","content":"测试内容"}'
```

## 📁 项目结构

```
memo-backend-api/
├── app.js                          # 主应用文件
├── entrypoint.sh                   # 一键启动脚本
├── package.json                    # 项目配置
├── .env.example                    # 环境变量示例
├── config/
│   └── database.js                 # 数据库配置
├── models/
│   └── Memo.js                     # 备忘录数据模型
├── routes/
│   └── memos.js                    # API路由
├── public/
│   └── index.html                  # 测试页面
├── api-md/                         # API文档目录
│   ├── API接口对接文档.md           # 完整API文档
│   ├── API快速参考.md              # 快速开发参考
│   ├── 部署说明.md                 # 部署指南
│   ├── 时间字段功能说明.md          # 时间字段说明
│   └── 备忘录应用后端API接口文档.md  # 原始需求文档
└── test-script/                    # 测试脚本目录
    ├── test-api.js                 # API接口测试
    ├── test-db.js                  # 数据库连接测试
    ├── test-time-fields.js         # 时间字段测试
    └── hello_world.js              # 原始示例文件
```

---

**DevBox: Code. Build. Deploy. We've Got the Rest.**

专注于代码开发，基础设施和部署交给我们处理。