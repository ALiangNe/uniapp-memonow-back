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
      createTime: this.formatDateTime(row.create_time),
      updateTime: this.formatDateTime(row.update_time)
    };
  }

  // 获取所有备忘录（按更新时间倒序）
  static async findAll() {
    const connection = getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM memos ORDER BY update_time DESC'
    );
    return rows.map(row => this.formatMemo(row));
  }

  // 根据ID获取备忘录
  static async findById(id) {
    const connection = getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM memos WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return null;
    }
    
    return this.formatMemo(rows[0]);
  }

  // 创建新备忘录
  static async create(title, content) {
    const connection = getConnection();
    const [result] = await connection.execute(
      'INSERT INTO memos (title, content) VALUES (?, ?)',
      [title, content]
    );
    
    // 获取新创建的备忘录
    return await this.findById(result.insertId);
  }

  // 更新备忘录
  static async update(id, title, content) {
    const connection = getConnection();
    const [result] = await connection.execute(
      'UPDATE memos SET title = ?, content = ? WHERE id = ?',
      [title, content, id]
    );
    
    if (result.affectedRows === 0) {
      return null;
    }
    
    return await this.findById(id);
  }

  // 删除备忘录
  static async delete(id) {
    const connection = getConnection();
    const [result] = await connection.execute(
      'DELETE FROM memos WHERE id = ?',
      [id]
    );
    
    return result.affectedRows > 0;
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
