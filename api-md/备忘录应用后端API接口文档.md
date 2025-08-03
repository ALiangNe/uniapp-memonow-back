# 备忘录应用后端API接口文档

这是一个基于nodejs的后端项目，我使用了devbox打开这个项目，数据库连接方式：mysql://root:j949trs7@test-db-mysql.ns-i0ev2cvd.svc:3306

## 概述
本文档描述了备忘录应用所需的后端API接口，包括备忘录的增删改查功能。

## 基础信息
- **基础URL**: `https://your-api-domain.com/api`
- **数据格式**: JSON
- **字符编码**: UTF-8
- **认证方式**: Bearer Token（可选，根据需求）

## 数据模型

### 备忘录对象 (Memo)
```json
{
  "id": 1,
  "title": "备忘录标题",
  "content": "备忘录内容",
  "createTime": "2024-01-15T10:30:00Z",
  "updateTime": "2024-01-15T14:20:00Z"
}
```

### 字段说明
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | Integer | 是 | 备忘录唯一标识 |
| title | String | 是 | 备忘录标题，最大长度50字符 |
| content | String | 是 | 备忘录内容，最大长度1000字符 |
| createTime | String | 是 | 创建时间，ISO 8601格式 |
| updateTime | String | 是 | 更新时间，ISO 8601格式 |

## API接口列表

### 1. 获取备忘录列表

**接口描述**: 获取所有备忘录列表，按更新时间倒序排列

**请求信息**:
- **URL**: `GET /memos`
- **请求方式**: GET
- **请求参数**: 无

**响应示例**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": [
    {
      "id": 1,
      "title": "学习uni-app开发",
      "content": "完成备忘录小程序的开发，包括前端界面设计和后端API接口开发。",
      "createTime": "2024-01-15T10:30:00Z",
      "updateTime": "2024-01-15T14:20:00Z"
    },
    {
      "id": 2,
      "title": "购买生活用品",
      "content": "牙膏、洗发水、纸巾、洗衣液、沐浴露、洗面奶等日常用品。",
      "createTime": "2024-01-14T09:15:00Z",
      "updateTime": "2024-01-14T09:15:00Z"
    }
  ]
}
```

### 2. 获取备忘录详情

**接口描述**: 根据ID获取单个备忘录的详细信息

**请求信息**:
- **URL**: `GET /memos/{id}`
- **请求方式**: GET
- **路径参数**:
  - `id` (Integer, 必填): 备忘录ID

**响应示例**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": 1,
    "title": "学习uni-app开发",
    "content": "完成备忘录小程序的开发，包括前端界面设计和后端API接口开发。学习Vue3语法和uni-app框架特性。\n\n需要掌握的技术点：\n1. Vue3 Composition API\n2. uni-app 生命周期\n3. 小程序组件开发",
    "createTime": "2024-01-15T10:30:00Z",
    "updateTime": "2024-01-15T14:20:00Z"
  }
}
```

**错误响应**:
```json
{
  "code": 404,
  "message": "备忘录不存在",
  "data": null
}
```

### 3. 创建备忘录

**接口描述**: 创建新的备忘录

**请求信息**:
- **URL**: `POST /memos`
- **请求方式**: POST
- **Content-Type**: `application/json`

**请求体**:
```json
{
  "title": "新备忘录标题",
  "content": "新备忘录内容"
}
```

**请求参数说明**:
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| title | String | 是 | 备忘录标题，1-50字符 |
| content | String | 是 | 备忘录内容，1-1000字符 |

**响应示例**:
```json
{
  "code": 201,
  "message": "创建成功",
  "data": {
    "id": 7,
    "title": "新备忘录标题",
    "content": "新备忘录内容",
    "createTime": "2024-01-16T10:30:00Z",
    "updateTime": "2024-01-16T10:30:00Z"
  }
}
```

**错误响应**:
```json
{
  "code": 400,
  "message": "参数错误",
  "data": {
    "errors": [
      "标题不能为空",
      "内容不能为空"
    ]
  }
}
```

### 4. 更新备忘录

**接口描述**: 更新指定ID的备忘录信息

**请求信息**:
- **URL**: `PUT /memos/{id}`
- **请求方式**: PUT
- **Content-Type**: `application/json`
- **路径参数**:
  - `id` (Integer, 必填): 备忘录ID

**请求体**:
```json
{
  "title": "更新后的标题",
  "content": "更新后的内容"
}
```

**请求参数说明**:
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| title | String | 是 | 备忘录标题，1-50字符 |
| content | String | 是 | 备忘录内容，1-1000字符 |

**响应示例**:
```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "id": 1,
    "title": "更新后的标题",
    "content": "更新后的内容",
    "createTime": "2024-01-15T10:30:00Z",
    "updateTime": "2024-01-16T15:45:00Z"
  }
}
```

**错误响应**:
```json
{
  "code": 404,
  "message": "备忘录不存在",
  "data": null
}
```

### 5. 删除备忘录

**接口描述**: 删除指定ID的备忘录

**请求信息**:
- **URL**: `DELETE /memos/{id}`
- **请求方式**: DELETE
- **路径参数**:
  - `id` (Integer, 必填): 备忘录ID

**响应示例**:
```json
{
  "code": 200,
  "message": "删除成功",
  "data": null
}
```

**错误响应**:
```json
{
  "code": 404,
  "message": "备忘录不存在",
  "data": null
}
```

## 统一响应格式

所有API接口都遵循统一的响应格式：

```json
{
  "code": 200,
  "message": "操作结果描述",
  "data": "具体数据或null"
}
```

### 状态码说明
| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

## 数据库设计建议

### 备忘录表 (memos)
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

## 前端调用示例

### JavaScript/uni-app调用示例

```javascript
// 获取备忘录列表
async function getMemos() {
  try {
    const response = await uni.request({
      url: 'https://your-api-domain.com/api/memos',
      method: 'GET'
    });
    return response.data;
  } catch (error) {
    console.error('获取备忘录列表失败:', error);
  }
}

// 获取备忘录详情
async function getMemoDetail(id) {
  try {
    const response = await uni.request({
      url: `https://your-api-domain.com/api/memos/${id}`,
      method: 'GET'
    });
    return response.data;
  } catch (error) {
    console.error('获取备忘录详情失败:', error);
  }
}

// 创建备忘录
async function createMemo(title, content) {
  try {
    const response = await uni.request({
      url: 'https://your-api-domain.com/api/memos',
      method: 'POST',
      data: { title, content }
    });
    return response.data;
  } catch (error) {
    console.error('创建备忘录失败:', error);
  }
}

// 更新备忘录
async function updateMemo(id, title, content) {
  try {
    const response = await uni.request({
      url: `https://your-api-domain.com/api/memos/${id}`,
      method: 'PUT',
      data: { title, content }
    });
    return response.data;
  } catch (error) {
    console.error('更新备忘录失败:', error);
  }
}

// 删除备忘录
async function deleteMemo(id) {
  try {
    const response = await uni.request({
      url: `https://your-api-domain.com/api/memos/${id}`,
      method: 'DELETE'
    });
    return response.data;
  } catch (error) {
    console.error('删除备忘录失败:', error);
  }
}
```

## 注意事项

1. **时间格式**: 所有时间字段使用ISO 8601格式 (YYYY-MM-DDTHH:mm:ssZ)
2. **字符限制**: 标题最大50字符，内容最大1000字符
3. **排序**: 列表接口按更新时间倒序返回
4. **错误处理**: 前端需要根据返回的code字段判断操作结果
5. **数据验证**: 后端需要对输入数据进行严格验证
6. **安全性**: 建议添加用户认证和权限控制（如需要）

## 扩展功能建议

如果后续需要扩展功能，可以考虑添加以下接口：

1. **搜索备忘录**: `GET /memos/search?keyword=关键词`
2. **分页查询**: `GET /memos?page=1&size=10`
3. **按分类查询**: `GET /memos?category=工作`
4. **批量删除**: `DELETE /memos/batch`

---

**文档版本**: v1.0
**最后更新**: 2024-01-16
**维护人员**: 开发团队
