# 微信小程序登录完整流程示例

## 🔄 登录流程图

```
小程序端                    后端API                    微信服务器
    |                         |                          |
    |-- wx.login() ---------->|                          |
    |<-- 返回 code ------------|                          |
    |                         |                          |
    |-- POST /api/auth/wechat-login ------------------>|
    |   { code, nickname, avatarUrl }                   |
    |                         |                          |
    |                         |-- code2session -------->|
    |                         |<-- openid, session_key --|
    |                         |                          |
    |<-- 返回用户信息 ---------|                          |
    |   { userId, userType, ... }                       |
```

## 📱 小程序端代码示例

### 1. 微信登录函数
```javascript
// 微信登录
async function wechatLogin() {
  try {
    // 1. 调用wx.login获取code
    const loginRes = await wx.login();
    if (!loginRes.code) {
      throw new Error('获取微信登录凭证失败');
    }
    
    console.log('获取到微信code:', loginRes.code);
    
    // 2. 获取用户信息（可选）
    let userInfo = {};
    try {
      const userInfoRes = await wx.getUserProfile({
        desc: '用于完善用户资料'
      });
      userInfo = {
        nickname: userInfoRes.userInfo.nickName,
        avatarUrl: userInfoRes.userInfo.avatarUrl
      };
    } catch (error) {
      console.log('用户拒绝授权用户信息');
    }
    
    // 3. 发送到后端进行登录
    const response = await wx.request({
      url: 'https://vgsarkerfnri.sealosbja.site/api/auth/wechat-login',
      method: 'POST',
      data: {
        code: loginRes.code,
        nickname: userInfo.nickname,
        avatarUrl: userInfo.avatarUrl
      }
    });
    
    if (response.data.code === 200) {
      const userData = response.data.data;
      console.log('登录成功:', userData);
      
      // 4. 保存用户信息到本地存储
      wx.setStorageSync('userId', userData.userId);
      wx.setStorageSync('userInfo', userData);
      
      return userData;
    } else {
      throw new Error(response.data.message);
    }
    
  } catch (error) {
    console.error('微信登录失败:', error);
    wx.showToast({
      title: '登录失败',
      icon: 'none'
    });
    throw error;
  }
}
```

### 2. 在页面中使用
```javascript
// pages/login/login.js
Page({
  data: {
    userInfo: null,
    isLoggedIn: false
  },
  
  onLoad() {
    // 检查是否已登录
    const userId = wx.getStorageSync('userId');
    if (userId) {
      const userInfo = wx.getStorageSync('userInfo');
      this.setData({
        userInfo,
        isLoggedIn: true
      });
    }
  },
  
  // 登录按钮点击事件
  async onLoginTap() {
    try {
      wx.showLoading({ title: '登录中...' });
      
      const userData = await wechatLogin();
      
      this.setData({
        userInfo: userData,
        isLoggedIn: true
      });
      
      wx.hideLoading();
      wx.showToast({
        title: '登录成功',
        icon: 'success'
      });
      
      // 跳转到主页
      wx.switchTab({
        url: '/pages/index/index'
      });
      
    } catch (error) {
      wx.hideLoading();
      console.error('登录失败:', error);
    }
  },
  
  // 退出登录
  onLogoutTap() {
    wx.removeStorageSync('userId');
    wx.removeStorageSync('userInfo');
    this.setData({
      userInfo: null,
      isLoggedIn: false
    });
    wx.showToast({
      title: '已退出登录',
      icon: 'success'
    });
  }
});
```

### 3. 登录页面模板
```html
<!-- pages/login/login.wxml -->
<view class="container">
  <view wx:if="{{!isLoggedIn}}" class="login-section">
    <image class="logo" src="/images/logo.png"></image>
    <text class="title">备忘录小程序</text>
    <text class="subtitle">记录生活，管理时间</text>
    
    <button class="login-btn" bindtap="onLoginTap">
      <image class="wechat-icon" src="/images/wechat.png"></image>
      微信登录
    </button>
  </view>
  
  <view wx:else class="user-section">
    <image class="avatar" src="{{userInfo.avatarUrl}}"></image>
    <text class="nickname">{{userInfo.nickname}}</text>
    <text class="user-id">ID: {{userInfo.userId}}</text>
    
    <button class="logout-btn" bindtap="onLogoutTap">退出登录</button>
  </view>
</view>
```

## 🔧 API调用工具函数

### 创建统一的API调用函数
```javascript
// utils/api.js

// 获取用户ID
function getUserId() {
  return wx.getStorageSync('userId');
}

// 统一的API请求函数
function request(options) {
  const userId = getUserId();
  
  return new Promise((resolve, reject) => {
    wx.request({
      url: `https://vgsarkerfnri.sealosbja.site${options.url}`,
      method: options.method || 'GET',
      data: options.data,
      header: {
        'Content-Type': 'application/json',
        'User-Id': userId, // 添加用户ID到请求头
        ...options.header
      },
      success: (res) => {
        if (res.data.code === 200 || res.data.code === 201) {
          resolve(res.data);
        } else {
          reject(new Error(res.data.message));
        }
      },
      fail: (error) => {
        reject(error);
      }
    });
  });
}

// 备忘录相关API
const memoAPI = {
  // 获取备忘录列表
  getList() {
    return request({
      url: '/api/memos',
      method: 'GET'
    });
  },
  
  // 创建备忘录
  create(data) {
    return request({
      url: '/api/memos',
      method: 'POST',
      data
    });
  },
  
  // 更新备忘录
  update(id, data) {
    return request({
      url: `/api/memos/${id}`,
      method: 'PUT',
      data
    });
  },
  
  // 删除备忘录
  delete(id) {
    return request({
      url: `/api/memos/${id}`,
      method: 'DELETE'
    });
  }
};

module.exports = {
  wechatLogin,
  request,
  memoAPI
};
```

## 🚀 使用示例

### 在备忘录页面中使用
```javascript
// pages/memo/memo.js
const { memoAPI } = require('../../utils/api');

Page({
  data: {
    memos: []
  },
  
  async onLoad() {
    await this.loadMemos();
  },
  
  // 加载备忘录列表
  async loadMemos() {
    try {
      wx.showLoading({ title: '加载中...' });
      
      const response = await memoAPI.getList();
      this.setData({
        memos: response.data
      });
      
      wx.hideLoading();
    } catch (error) {
      wx.hideLoading();
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
      console.error('加载备忘录失败:', error);
    }
  },
  
  // 创建备忘录
  async createMemo() {
    try {
      const response = await memoAPI.create({
        title: '新备忘录',
        content: '备忘录内容'
      });
      
      wx.showToast({
        title: '创建成功',
        icon: 'success'
      });
      
      // 刷新列表
      await this.loadMemos();
    } catch (error) {
      wx.showToast({
        title: '创建失败',
        icon: 'none'
      });
    }
  }
});
```

## 📝 注意事项

1. **code的有效期**: 微信登录code只能使用一次，且有效期为5分钟
2. **用户授权**: getUserProfile需要用户主动触发（如点击按钮）
3. **错误处理**: 要处理网络错误、用户拒绝授权等情况
4. **数据存储**: 用户信息存储在本地，注意数据安全
5. **服务器域名**: 确保在微信后台配置了正确的服务器域名

## 🔍 调试技巧

1. 在微信开发者工具中查看网络请求
2. 使用console.log输出关键信息
3. 检查微信后台的服务器域名配置
4. 验证AppID和AppSecret配置是否正确
