const express = require('express');
const router = express.Router();
const Memo = require('../models/Memo');

// 获取备忘录列表
router.get('/', async (req, res) => {
  try {
    const memos = await Memo.findAll();
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
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({
        code: 400,
        message: '无效的备忘录ID',
        data: null
      });
    }
    
    const memo = await Memo.findById(id);
    
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
router.post('/', async (req, res) => {
  try {
    const { title, content } = req.body;
    
    // 验证输入数据
    const errors = Memo.validate(title, content);
    if (errors.length > 0) {
      return res.status(400).json({
        code: 400,
        message: '参数错误',
        data: { errors }
      });
    }
    
    const memo = await Memo.create(title.trim(), content.trim());
    
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
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, content } = req.body;
    
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
    
    const memo = await Memo.update(id, title.trim(), content.trim());
    
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
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({
        code: 400,
        message: '无效的备忘录ID',
        data: null
      });
    }
    
    const deleted = await Memo.delete(id);
    
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
