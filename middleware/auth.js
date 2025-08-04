const User = require('../models/User');

// 用户身份验证中间件
const userAuthMiddleware = async (req, res, next) => {
  try {
    const userId = req.headers['user-id'];

    // 检查是否提供了用户ID
    if (!userId) {
      return res.status(400).json({
        code: 400,
        message: '缺少用户身份标识',
        data: null
      });
    }

    // 验证用户ID格式
    if (!User.validateUserId(userId)) {
      return res.status(400).json({
        code: 400,
        message: '无效的用户标识格式',
        data: null
      });
    }

    // 自动注册或更新用户活跃时间
    try {
      await User.autoRegister(userId);
      req.userId = userId;
      next();
    } catch (error) {
      console.error('用户验证失败:', error);
      return res.status(500).json({
        code: 500,
        message: '用户验证失败',
        data: null
      });
    }
  } catch (error) {
    console.error('身份验证中间件错误:', error);
    return res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      data: null
    });
  }
};

// 可选的用户身份验证中间件（用于不强制要求登录的接口）
const optionalUserAuthMiddleware = async (req, res, next) => {
  try {
    const userId = req.headers['user-id'];

    if (userId && User.validateUserId(userId)) {
      try {
        await User.autoRegister(userId);
        req.userId = userId;
      } catch (error) {
        console.error('可选用户验证失败:', error);
        // 不阻断请求，继续执行
      }
    }

    next();
  } catch (error) {
    console.error('可选身份验证中间件错误:', error);
    next(); // 不阻断请求
  }
};

module.exports = {
  userAuthMiddleware,
  optionalUserAuthMiddleware
};
