const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { userAuthMiddleware } = require('../middleware/auth');

// 用户自动注册/更新活跃时间
router.post('/register', userAuthMiddleware, async (req, res) => {
  try {
    const { nickname, avatarUrl } = req.body;
    const userId = req.userId;

    const user = await User.autoRegister(userId, { nickname, avatarUrl });

    res.json({
      code: 200,
      message: '用户信息更新成功',
      data: user
    });
  } catch (error) {
    console.error('用户注册失败:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      data: null
    });
  }
});

// 获取用户信息
router.get('/profile', userAuthMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findByUserId(userId);

    if (!user) {
      return res.status(404).json({
        code: 404,
        message: '用户不存在',
        data: null
      });
    }

    res.json({
      code: 200,
      message: '获取成功',
      data: user
    });
  } catch (error) {
    console.error('获取用户信息失败:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      data: null
    });
  }
});

// 更新用户信息
router.put('/profile', userAuthMiddleware, async (req, res) => {
  try {
    const { nickname, avatarUrl } = req.body;
    const userId = req.userId;

    // 验证输入数据
    if (!nickname && !avatarUrl) {
      return res.status(400).json({
        code: 400,
        message: '至少需要提供昵称或头像URL',
        data: null
      });
    }

    const user = await User.updateProfile(userId, { nickname, avatarUrl });

    if (!user) {
      return res.status(404).json({
        code: 404,
        message: '用户不存在',
        data: null
      });
    }

    res.json({
      code: 200,
      message: '更新成功',
      data: user
    });
  } catch (error) {
    console.error('更新用户信息失败:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      data: null
    });
  }
});

// 获取用户统计信息
router.get('/stats', userAuthMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const stats = await User.getUserStats(userId);

    res.json({
      code: 200,
      message: '获取成功',
      data: stats
    });
  } catch (error) {
    console.error('获取用户统计失败:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      data: null
    });
  }
});

module.exports = router;
