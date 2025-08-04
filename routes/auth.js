const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { validateWechatConfig, testWechatAPI } = require('../utils/wechat-config');

// 微信小程序登录
router.post('/wechat-login', async (req, res) => {
  try {
    const { code, nickname, avatarUrl } = req.body;

    // 验证必要参数
    if (!code) {
      return res.status(400).json({
        code: 400,
        message: '缺少微信登录凭证code',
        data: {
          help: '请在小程序端调用wx.login()获取code，然后传递给此接口'
        }
      });
    }

    // 验证code格式（微信code通常是32位字符串）
    if (typeof code !== 'string' || code.length < 10) {
      return res.status(400).json({
        code: 400,
        message: '无效的微信登录凭证code格式',
        data: null
      });
    }

    try {
      console.log('开始微信登录流程...', {
        codeLength: code.length,
        hasNickname: !!nickname,
        hasAvatarUrl: !!avatarUrl
      });

      const user = await User.wechatLogin(code, { nickname, avatarUrl });

      console.log('微信登录成功:', { userId: user.userId });

      res.json({
        code: 200,
        message: '登录成功',
        data: user
      });
    } catch (error) {
      console.error('微信登录处理失败:', error);

      // 根据错误类型返回不同的错误信息
      let errorMessage = error.message;
      let errorCode = 400;

      if (error.message.includes('微信配置未设置')) {
        errorCode = 500;
        errorMessage = '服务器微信配置错误，请联系管理员';
      } else if (error.message.includes('AppID无效')) {
        errorCode = 500;
        errorMessage = '微信AppID配置错误';
      } else if (error.message.includes('AppSecret无效')) {
        errorCode = 500;
        errorMessage = '微信AppSecret配置错误';
      } else if (error.message.includes('code无效')) {
        errorMessage = '微信登录凭证已过期或无效，请重新获取';
      } else if (error.message.includes('API调用太频繁')) {
        errorMessage = '登录请求太频繁，请稍后再试';
      }

      res.status(errorCode).json({
        code: errorCode,
        message: errorMessage,
        data: null
      });
    }
  } catch (error) {
    console.error('微信登录接口错误:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      data: null
    });
  }
});

// 生成测试用户ID（用于开发测试）
router.post('/test-login', async (req, res) => {
  try {
    const { userType = 'h5', nickname, avatarUrl } = req.body;
    
    // 生成测试用户ID
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const userId = `${userType}_test_${timestamp}_${random}`;

    const user = await User.autoRegister(userId, { nickname, avatarUrl });

    res.json({
      code: 200,
      message: '测试登录成功',
      data: user
    });
  } catch (error) {
    console.error('测试登录失败:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      data: null
    });
  }
});

// 检查微信配置状态
router.get('/wechat-config', async (req, res) => {
  try {
    const validation = validateWechatConfig();

    res.json({
      code: 200,
      message: '微信配置检查完成',
      data: {
        configured: validation.valid,
        errors: validation.errors,
        warnings: validation.warnings,
        hasAppId: !!process.env.WECHAT_APPID,
        hasSecret: !!process.env.WECHAT_SECRET
      }
    });
  } catch (error) {
    console.error('检查微信配置失败:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      data: null
    });
  }
});

// 测试微信API连接
router.post('/test-wechat-api', async (req, res) => {
  try {
    const testResult = await testWechatAPI();

    res.json({
      code: testResult.success ? 200 : 400,
      message: testResult.success ? testResult.message : testResult.error,
      data: testResult
    });
  } catch (error) {
    console.error('测试微信API失败:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      data: null
    });
  }
});

module.exports = router;
