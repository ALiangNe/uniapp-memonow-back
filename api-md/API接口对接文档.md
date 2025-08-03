# 备忘录应用API接口对接文档

## 基础信息
- **服务器地址**: `https://vgsarkerfnri.sealosbja.site`
- **API基础路径**: `/api`
- **数据格式**: JSON
- **字符编码**: UTF-8
- **请求头**: `Content-Type: application/json`

## 统一响应格式
所有接口都遵循以下响应格式：
```json
{
  "code": 200,
  "message": "操作结果描述",
  "data": "具体数据或null"
}
```

## 状态码说明
| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 1. 获取备忘录列表

### 接口信息
- **URL**: `GET /api/memos`
- **描述**: 获取所有备忘录，按更新时间倒序排列
- **请求参数**: 无

### 请求示例
```javascript
// uni-app
uni.request({
  url: 'https://vgsarkerfnri.sealosbja.site/api/memos',
  method: 'GET',
  success: (res) => {
    console.log(res.data);
  }
});

// 原生JavaScript
fetch('https://vgsarkerfnri.sealosbja.site/api/memos')
  .then(response => response.json())
  .then(data => console.log(data));
```

### 成功响应 (200)
```json
{
  "code": 200,
  "message": "获取成功",
  "data": [
    {
      "id": 1,
      "title": "学习uni-app开发",
      "content": "完成备忘录小程序的开发，包括前端界面设计和后端API接口开发。",
      "createTime": "2025-08-02T12:35:47.000Z",
      "updateTime": "2025-08-02T12:35:47.000Z"
    },
    {
      "id": 2,
      "title": "购买生活用品",
      "content": "牙膏、洗发水、纸巾、洗衣液、沐浴露、洗面奶等日常用品。",
      "createTime": "2025-08-02T12:36:52.000Z",
      "updateTime": "2025-08-02T12:36:52.000Z"
    }
  ]
}
```

### 失败响应 (500)
```json
{
  "code": 500,
  "message": "服务器内部错误",
  "data": null
}
```

---

## 2. 获取备忘录详情

### 接口信息
- **URL**: `GET /api/memos/{id}`
- **描述**: 根据ID获取单个备忘录的详细信息
- **路径参数**: 
  - `id` (必填): 备忘录ID

### 请求示例
```javascript
// uni-app
uni.request({
  url: 'https://vgsarkerfnri.sealosbja.site/api/memos/1',
  method: 'GET',
  success: (res) => {
    console.log(res.data);
  }
});

// 原生JavaScript
fetch('https://vgsarkerfnri.sealosbja.site/api/memos/1')
  .then(response => response.json())
  .then(data => console.log(data));
```

### 成功响应 (200)
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": 1,
    "title": "学习uni-app开发",
    "content": "完成备忘录小程序的开发，包括前端界面设计和后端API接口开发。学习Vue3语法和uni-app框架特性。\n\n需要掌握的技术点：\n1. Vue3 Composition API\n2. uni-app 生命周期\n3. 小程序组件开发",
    "createTime": "2025-08-02T12:35:47.000Z",
    "updateTime": "2025-08-02T12:35:47.000Z"
  }
}
```

### 失败响应 (404)
```json
{
  "code": 404,
  "message": "备忘录不存在",
  "data": null
}
```

### 失败响应 (400)
```json
{
  "code": 400,
  "message": "无效的备忘录ID",
  "data": null
}
```

---

## 3. 创建备忘录

### 接口信息
- **URL**: `POST /api/memos`
- **描述**: 创建新的备忘录
- **请求体参数**:
  - `title` (必填): 备忘录标题，1-50字符
  - `content` (必填): 备忘录内容，1-1000字符

### 请求示例
```javascript
// uni-app
uni.request({
  url: 'https://vgsarkerfnri.sealosbja.site/api/memos',
  method: 'POST',
  data: {
    title: '新备忘录标题',
    content: '新备忘录内容'
  },
  success: (res) => {
    console.log(res.data);
  }
});

// 原生JavaScript
fetch('https://vgsarkerfnri.sealosbja.site/api/memos', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: '新备忘录标题',
    content: '新备忘录内容'
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

### 成功响应 (201)
```json
{
  "code": 201,
  "message": "创建成功",
  "data": {
    "id": 7,
    "title": "新备忘录标题",
    "content": "新备忘录内容",
    "createTime": "2025-08-02T14:30:00.000Z",
    "updateTime": "2025-08-02T14:30:00.000Z"
  }
}
```

### 失败响应 (400)
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

---

## 4. 更新备忘录

### 接口信息
- **URL**: `PUT /api/memos/{id}`
- **描述**: 更新指定ID的备忘录信息
- **路径参数**: 
  - `id` (必填): 备忘录ID
- **请求体参数**:
  - `title` (必填): 备忘录标题，1-50字符
  - `content` (必填): 备忘录内容，1-1000字符

### 请求示例
```javascript
// uni-app
uni.request({
  url: 'https://vgsarkerfnri.sealosbja.site/api/memos/1',
  method: 'PUT',
  data: {
    title: '更新后的标题',
    content: '更新后的内容'
  },
  success: (res) => {
    console.log(res.data);
  }
});

// 原生JavaScript
fetch('https://vgsarkerfnri.sealosbja.site/api/memos/1', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: '更新后的标题',
    content: '更新后的内容'
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

### 成功响应 (200)
```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "id": 1,
    "title": "更新后的标题",
    "content": "更新后的内容",
    "createTime": "2025-08-02T12:35:47.000Z",
    "updateTime": "2025-08-02T15:45:00.000Z"
  }
}
```

### 失败响应 (404)
```json
{
  "code": 404,
  "message": "备忘录不存在",
  "data": null
}
```

### 失败响应 (400)
```json
{
  "code": 400,
  "message": "参数错误",
  "data": {
    "errors": [
      "标题不能为空"
    ]
  }
}
```

---

## 5. 删除备忘录

### 接口信息
- **URL**: `DELETE /api/memos/{id}`
- **描述**: 删除指定ID的备忘录
- **路径参数**: 
  - `id` (必填): 备忘录ID

### 请求示例
```javascript
// uni-app
uni.request({
  url: 'https://vgsarkerfnri.sealosbja.site/api/memos/1',
  method: 'DELETE',
  success: (res) => {
    console.log(res.data);
  }
});

// 原生JavaScript
fetch('https://vgsarkerfnri.sealosbja.site/api/memos/1', {
  method: 'DELETE'
})
.then(response => response.json())
.then(data => console.log(data));
```

### 成功响应 (200)
```json
{
  "code": 200,
  "message": "删除成功",
  "data": null
}
```

### 失败响应 (404)
```json
{
  "code": 404,
  "message": "备忘录不存在",
  "data": null
}
```

### 失败响应 (400)
```json
{
  "code": 400,
  "message": "无效的备忘录ID",
  "data": null
}
```

---

## 错误处理建议

### 前端错误处理示例
```javascript
// uni-app 错误处理
function handleApiResponse(res) {
  const { code, message, data } = res.data;
  
  switch(code) {
    case 200:
    case 201:
      // 成功处理
      return data;
    case 400:
      // 参数错误
      uni.showToast({
        title: message,
        icon: 'none'
      });
      break;
    case 404:
      // 资源不存在
      uni.showToast({
        title: '数据不存在',
        icon: 'none'
      });
      break;
    case 500:
      // 服务器错误
      uni.showToast({
        title: '服务器错误，请稍后重试',
        icon: 'none'
      });
      break;
    default:
      uni.showToast({
        title: '未知错误',
        icon: 'none'
      });
  }
  return null;
}

// 使用示例
uni.request({
  url: 'https://vgsarkerfnri.sealosbja.site/api/memos',
  method: 'GET',
  success: (res) => {
    const data = handleApiResponse(res);
    if (data) {
      // 处理成功数据
      this.memoList = data;
    }
  },
  fail: (err) => {
    uni.showToast({
      title: '网络错误',
      icon: 'none'
    });
  }
});
```

## 注意事项

1. **时间格式**: 所有时间字段使用ISO 8601格式 (YYYY-MM-DDTHH:mm:ss.sssZ)
2. **字符限制**: 标题最大50字符，内容最大1000字符
3. **排序**: 列表接口按更新时间倒序返回
4. **错误处理**: 前端需要根据返回的code字段判断操作结果
5. **网络超时**: 建议设置合理的请求超时时间
6. **数据验证**: 前端也应该进行基本的数据验证

## 测试地址

- **API根地址**: https://vgsarkerfnri.sealosbja.site
- **测试页面**: https://vgsarkerfnri.sealosbja.site (浏览器访问可看到测试界面)
- **健康检查**: https://vgsarkerfnri.sealosbja.site (返回API状态信息)
