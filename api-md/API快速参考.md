# 备忘录API快速参考

## 基础配置
```javascript
const API_BASE = 'https://vgsarkerfnri.sealosbja.site/api';
```

## 1. 获取备忘录列表
```javascript
// GET /api/memos
uni.request({
  url: `${API_BASE}/memos`,
  method: 'GET',
  success: (res) => {
    // res.data.data 是备忘录数组
    console.log(res.data);
  }
});
```

## 2. 获取备忘录详情
```javascript
// GET /api/memos/:id
uni.request({
  url: `${API_BASE}/memos/${id}`,
  method: 'GET',
  success: (res) => {
    // res.data.data 是备忘录对象
    console.log(res.data);
  }
});
```

## 3. 创建备忘录
```javascript
// POST /api/memos
uni.request({
  url: `${API_BASE}/memos`,
  method: 'POST',
  data: {
    title: '标题',
    content: '内容'
  },
  success: (res) => {
    // res.data.data 是新创建的备忘录对象
    console.log(res.data);
  }
});
```

## 4. 更新备忘录
```javascript
// PUT /api/memos/:id
uni.request({
  url: `${API_BASE}/memos/${id}`,
  method: 'PUT',
  data: {
    title: '新标题',
    content: '新内容'
  },
  success: (res) => {
    // res.data.data 是更新后的备忘录对象
    console.log(res.data);
  }
});
```

## 5. 删除备忘录
```javascript
// DELETE /api/memos/:id
uni.request({
  url: `${API_BASE}/memos/${id}`,
  method: 'DELETE',
  success: (res) => {
    // res.data.data 是 null
    console.log(res.data);
  }
});
```

## 数据结构

### 备忘录对象
```javascript
{
  id: 1,
  title: "备忘录标题",
  content: "备忘录内容",
  createTime: "2025-08-02T12:35:47.000Z",
  updateTime: "2025-08-02T12:35:47.000Z"
}
```

### 响应格式
```javascript
{
  code: 200,        // 状态码
  message: "成功",   // 消息
  data: {}          // 数据
}
```

## 状态码
- `200` - 成功
- `201` - 创建成功
- `400` - 参数错误
- `404` - 不存在
- `500` - 服务器错误

## 完整示例 (uni-app)
```javascript
export default {
  data() {
    return {
      memoList: [],
      API_BASE: 'https://vgsarkerfnri.sealosbja.site/api'
    }
  },
  
  methods: {
    // 获取列表
    async getMemos() {
      try {
        const res = await uni.request({
          url: `${this.API_BASE}/memos`,
          method: 'GET'
        });
        
        if (res.data.code === 200) {
          this.memoList = res.data.data;
        }
      } catch (error) {
        console.error('获取失败:', error);
      }
    },
    
    // 创建备忘录
    async createMemo(title, content) {
      try {
        const res = await uni.request({
          url: `${this.API_BASE}/memos`,
          method: 'POST',
          data: { title, content }
        });
        
        if (res.data.code === 201) {
          uni.showToast({ title: '创建成功' });
          this.getMemos(); // 刷新列表
        }
      } catch (error) {
        uni.showToast({ title: '创建失败', icon: 'none' });
      }
    },
    
    // 删除备忘录
    async deleteMemo(id) {
      try {
        const res = await uni.request({
          url: `${this.API_BASE}/memos/${id}`,
          method: 'DELETE'
        });
        
        if (res.data.code === 200) {
          uni.showToast({ title: '删除成功' });
          this.getMemos(); // 刷新列表
        }
      } catch (error) {
        uni.showToast({ title: '删除失败', icon: 'none' });
      }
    }
  },
  
  onLoad() {
    this.getMemos();
  }
}
```
