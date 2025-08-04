const express = require('express');
const router = express.Router();
const Memo = require('../models/Memo');
const { userAuthMiddleware } = require('../middleware/auth');

// 获取备忘录列表
router.get('/', userAuthMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const memos = await Memo.findByUserId(userId);

    res.json({
      code: 200,
      message: '获取成功',
      data: memos
    });
  } catch (error) {
    console.error('获取备忘录列表失败:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      data: null
    });
  }
});

// 获取备忘录详情
router.get('/:id', userAuthMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const userId = req.userId;

    if (isNaN(id) || id <= 0) {
      return res.status(400).json({
        code: 400,
        message: '无效的备忘录ID',
        data: null
      });
    }

    const memo = await Memo.findByIdAndUserId(id, userId);

    if (!memo) {
      return res.status(404).json({
        code: 404,
        message: '备忘录不存在',
        data: null
      });
    }

    res.json({
      code: 200,
      message: '获取成功',
      data: memo
    });
  } catch (error) {
    console.error('获取备忘录详情失败:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      data: null
    });
  }
});

// 创建备忘录
router.post('/', userAuthMiddleware, async (req, res) => {
  try {
    const { title, content, priority, status, tags } = req.body;
    const userId = req.userId;

    // 验证输入数据
    const errors = Memo.validate(title, content);
    if (errors.length > 0) {
      return res.status(400).json({
        code: 400,
        message: '参数错误',
        data: { errors }
      });
    }

    const options = {};
    if (priority !== undefined) options.priority = priority;
    if (status !== undefined) options.status = status;
    if (tags !== undefined) options.tags = tags;

    const memo = await Memo.create(userId, title.trim(), content.trim(), options);

    res.status(201).json({
      code: 201,
      message: '创建成功',
      data: memo
    });
  } catch (error) {
    console.error('创建备忘录失败:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      data: null
    });
  }
});

// 更新备忘录
router.put('/:id', userAuthMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, content, priority, status, tags } = req.body;
    const userId = req.userId;

    if (isNaN(id) || id <= 0) {
      return res.status(400).json({
        code: 400,
        message: '无效的备忘录ID',
        data: null
      });
    }

    // 验证输入数据
    const errors = Memo.validate(title, content);
    if (errors.length > 0) {
      return res.status(400).json({
        code: 400,
        message: '参数错误',
        data: { errors }
      });
    }

    const options = {};
    if (priority !== undefined) options.priority = priority;
    if (status !== undefined) options.status = status;
    if (tags !== undefined) options.tags = tags;

    const memo = await Memo.update(id, userId, title.trim(), content.trim(), options);

    if (!memo) {
      return res.status(404).json({
        code: 404,
        message: '备忘录不存在',
        data: null
      });
    }

    res.json({
      code: 200,
      message: '更新成功',
      data: memo
    });
  } catch (error) {
    console.error('更新备忘录失败:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      data: null
    });
  }
});

// 删除备忘录
router.delete('/:id', userAuthMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const userId = req.userId;

    if (isNaN(id) || id <= 0) {
      return res.status(400).json({
        code: 400,
        message: '无效的备忘录ID',
        data: null
      });
    }

    const deleted = await Memo.delete(id, userId);

    if (!deleted) {
      return res.status(404).json({
        code: 404,
        message: '备忘录不存在',
        data: null
      });
    }

    res.json({
      code: 200,
      message: '删除成功',
      data: null
    });
  } catch (error) {
    console.error('删除备忘录失败:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      data: null
    });
  }
});

module.exports = router;
