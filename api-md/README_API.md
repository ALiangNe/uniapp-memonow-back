# 备忘录应用后端API

这是一个基于Node.js和Express框架开发的备忘录应用后端API服务。

## 项目结构

```
memo-backend-api/
├── app.js                 # 主应用文件
├── package.json           # 项目依赖配置
├── .env                   # 环境变量配置
├── config/
│   └── database.js        # 数据库配置
├── models/
│   └── Memo.js           # 备忘录数据模型
└── routes/
    └── memos.js          # 备忘录路由
```

## 安装和运行

### 1. 安装依赖
```bash
npm install
```

### 2. 配置环境变量
编辑 `.env` 文件，配置数据库连接信息：
```
PORT=3000
DB_HOST=test-db-mysql.ns-i0ev2cvd.svc
DB_PORT=3306
DB_USER=root
DB_PASSWORD=j949trs7
DB_NAME=memo_app
```

### 3. 启动服务
```bash
# 开发模式（自动重启）
npm run dev

# 生产模式
npm start
```

服务启动后，访问 http://localhost:3000 查看API状态。

## API接口

### 基础URL
```
http://localhost:3000/api
```

### 接口列表

1. **获取备忘录列表**
   - `GET /memos`
   - 返回所有备忘录，按更新时间倒序

2. **获取备忘录详情**
   - `GET /memos/:id`
   - 根据ID获取单个备忘录

3. **创建备忘录**
   - `POST /memos`
   - 创建新的备忘录

4. **更新备忘录**
   - `PUT /memos/:id`
   - 更新指定ID的备忘录

5. **删除备忘录**
   - `DELETE /memos/:id`
   - 删除指定ID的备忘录

## 数据库

项目使用MySQL数据库，启动时会自动创建数据库和表结构。

### 备忘录表结构
```sql
CREATE TABLE memos (
  id INT PRIMARY KEY AUTO_INCREMENT COMMENT '备忘录ID',
  title VARCHAR(50) NOT NULL COMMENT '标题',
  content TEXT NOT NULL COMMENT '内容',
  create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_update_time (update_time DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='备忘录表';
```

## 技术栈

- **Node.js** - 运行环境
- **Express** - Web框架
- **MySQL2** - 数据库驱动
- **CORS** - 跨域支持
- **Body-parser** - 请求体解析
- **Dotenv** - 环境变量管理

## 开发说明

1. 所有API响应都遵循统一格式：
   ```json
   {
     "code": 200,
     "message": "操作结果描述",
     "data": "具体数据或null"
   }
   ```

2. 时间格式使用ISO 8601标准
3. 输入数据会进行严格验证
4. 包含完整的错误处理机制

## 测试

可以使用Postman、curl或其他HTTP客户端测试API接口。

### 示例请求

```bash
# 获取备忘录列表
curl http://localhost:3000/api/memos

# 创建备忘录
curl -X POST http://localhost:3000/api/memos \
  -H "Content-Type: application/json" \
  -d '{"title":"测试标题","content":"测试内容"}'
```
