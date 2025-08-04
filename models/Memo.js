const { getConnection } = require('../config/database');

class Memo {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.content = data.content;
    this.createTime = data.create_time;
    this.updateTime = data.update_time;
  }

  // 格式化时间为ISO 8601格式
  static formatDateTime(dateTime) {
    if (!dateTime) return null;
    return new Date(dateTime).toISOString();
  }

  // 将数据库记录转换为API响应格式
  static formatMemo(row) {
    return {
      id: row.id,
      title: row.title,
      content: row.content,
      priority: row.priority || 0,
      status: row.status || 0,
      tags: row.tags ? JSON.parse(row.tags) : [],
      createTime: this.formatDateTime(row.created_time),
      updateTime: this.formatDateTime(row.updated_time)
    };
  }

  // 获取用户的所有备忘录（按更新时间倒序）
  static async findByUserId(userId) {
    const connection = getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM memos WHERE user_id = ? ORDER BY updated_time DESC',
      [userId]
    );
    return rows.map(row => this.formatMemo(row));
  }

  // 根据ID和用户ID获取备忘录
  static async findByIdAndUserId(id, userId) {
    const connection = getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM memos WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (rows.length === 0) {
      return null;
    }

    return this.formatMemo(rows[0]);
  }

  // 创建新备忘录
  static async create(userId, title, content, options = {}) {
    const connection = getConnection();
    const { priority = 0, status = 0, tags = [] } = options;
    const tagsJson = JSON.stringify(tags);

    const [result] = await connection.execute(
      'INSERT INTO memos (user_id, title, content, priority, status, tags) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, title, content, priority, status, tagsJson]
    );

    // 更新用户备忘录数量
    await this.updateUserMemoCount(userId);

    // 获取新创建的备忘录
    return await this.findByIdAndUserId(result.insertId, userId);
  }

  // 更新备忘录
  static async update(id, userId, title, content, options = {}) {
    const connection = getConnection();
    const { priority, status, tags } = options;

    let updateFields = ['title = ?', 'content = ?', 'updated_time = NOW()'];
    let updateValues = [title, content];

    if (priority !== undefined) {
      updateFields.push('priority = ?');
      updateValues.push(priority);
    }

    if (status !== undefined) {
      updateFields.push('status = ?');
      updateValues.push(status);
    }

    if (tags !== undefined) {
      updateFields.push('tags = ?');
      updateValues.push(JSON.stringify(tags));
    }

    updateValues.push(userId, id);

    const [result] = await connection.execute(
      `UPDATE memos SET ${updateFields.join(', ')} WHERE user_id = ? AND id = ?`,
      updateValues
    );

    if (result.affectedRows === 0) {
      return null;
    }

    return await this.findByIdAndUserId(id, userId);
  }

  // 删除备忘录
  static async delete(id, userId) {
    const connection = getConnection();
    const [result] = await connection.execute(
      'DELETE FROM memos WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (result.affectedRows > 0) {
      // 更新用户备忘录数量
      await this.updateUserMemoCount(userId);
      return true;
    }

    return false;
  }

  // 更新用户备忘录数量
  static async updateUserMemoCount(userId) {
    const connection = getConnection();
    await connection.execute(`
      UPDATE users SET memo_count = (
        SELECT COUNT(*) FROM memos WHERE user_id = ?
      ) WHERE user_id = ?
    `, [userId, userId]);
  }

  // 验证备忘录数据
  static validate(title, content) {
    const errors = [];
    
    if (!title || title.trim() === '') {
      errors.push('标题不能为空');
    } else if (title.length > 50) {
      errors.push('标题不能超过50个字符');
    }
    
    if (!content || content.trim() === '') {
      errors.push('内容不能为空');
    } else if (content.length > 1000) {
      errors.push('内容不能超过1000个字符');
    }
    
    return errors;
  }
}

module.exports = Memo;
