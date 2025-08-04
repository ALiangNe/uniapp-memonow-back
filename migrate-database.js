const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrateDatabase() {
  try {
    console.log('开始数据库迁移...');
    
    // 连接到数据库
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'test-db-mysql.ns-i0ev2cvd.svc',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'j949trs7',
      database: process.env.DB_NAME || 'memo_app',
      charset: 'utf8mb4'
    });
    
    console.log('数据库连接成功！');
    
    // 备份现有数据（如果有的话）
    console.log('备份现有备忘录数据...');
    let existingMemos = [];
    try {
      const [rows] = await connection.execute('SELECT * FROM memos');
      existingMemos = rows;
      console.log(`找到 ${existingMemos.length} 条现有备忘录`);
    } catch (error) {
      console.log('没有找到现有备忘录表或数据');
    }
    
    // 删除旧表
    console.log('删除旧表结构...');
    await connection.execute('DROP TABLE IF EXISTS memos');
    await connection.execute('DROP TABLE IF EXISTS users');
    
    // 创建用户表
    console.log('创建用户表...');
    await connection.execute(`
      CREATE TABLE users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id VARCHAR(100) UNIQUE NOT NULL COMMENT '用户唯一标识',
        user_type ENUM('wx', 'h5', 'app', 'other') NOT NULL COMMENT '用户类型',
        openid VARCHAR(50) DEFAULT NULL COMMENT '微信openid（仅微信用户）',
        session_key VARCHAR(50) DEFAULT NULL COMMENT '微信session_key（仅微信用户）',
        nickname VARCHAR(50) DEFAULT NULL COMMENT '用户昵称',
        avatar_url VARCHAR(255) DEFAULT NULL COMMENT '头像URL',
        memo_count INT DEFAULT 0 COMMENT '备忘录数量',
        last_active_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '最后活跃时间',
        created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
        updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
        INDEX idx_user_id (user_id),
        INDEX idx_openid (openid),
        INDEX idx_user_type (user_type),
        INDEX idx_last_active (last_active_time)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户信息表'
    `);
    
    // 创建备忘录表（支持多用户）
    console.log('创建备忘录表...');
    await connection.execute(`
      CREATE TABLE memos (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id VARCHAR(100) NOT NULL COMMENT '用户唯一标识',
        title VARCHAR(200) NOT NULL COMMENT '备忘录标题',
        content TEXT COMMENT '备忘录内容',
        priority TINYINT DEFAULT 0 COMMENT '优先级 0-普通 1-重要 2-紧急',
        status TINYINT DEFAULT 0 COMMENT '状态 0-未完成 1-已完成',
        tags VARCHAR(500) DEFAULT NULL COMMENT '标签，JSON格式',
        created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
        updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
        INDEX idx_user_id (user_id),
        INDEX idx_created_time (created_time),
        INDEX idx_updated_time (updated_time),
        INDEX idx_status (status),
        INDEX idx_priority (priority),
        INDEX idx_user_update_time (user_id, updated_time DESC)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='备忘录表'
    `);
    
    // 如果有现有数据，尝试迁移（为所有旧数据分配一个默认用户）
    if (existingMemos.length > 0) {
      console.log('迁移现有备忘录数据...');
      
      // 创建一个默认用户用于旧数据
      const defaultUserId = 'other_migrated_user_' + Date.now();
      await connection.execute(`
        INSERT INTO users (user_id, user_type, nickname, memo_count)
        VALUES (?, 'other', '迁移用户', ?)
      `, [defaultUserId, existingMemos.length]);
      
      // 迁移备忘录数据
      for (const memo of existingMemos) {
        await connection.execute(`
          INSERT INTO memos (user_id, title, content, created_time, updated_time)
          VALUES (?, ?, ?, ?, ?)
        `, [
          defaultUserId,
          memo.title,
          memo.content,
          memo.create_time || memo.created_time,
          memo.update_time || memo.updated_time
        ]);
      }
      
      console.log(`成功迁移 ${existingMemos.length} 条备忘录到用户 ${defaultUserId}`);
    }
    
    console.log('数据库迁移完成！');
    console.log('新的表结构:');
    console.log('- users: 用户信息表');
    console.log('- memos: 备忘录表（支持多用户）');
    
    await connection.end();
    
  } catch (error) {
    console.error('数据库迁移失败:', error);
    process.exit(1);
  }
}

migrateDatabase();
