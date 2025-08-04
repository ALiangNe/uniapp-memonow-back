const mysql = require('mysql2/promise');

// 数据库配置
const dbConfig = {
  host: process.env.DB_HOST || 'test-db-mysql.ns-i0ev2cvd.svc',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'j949trs7',
  database: process.env.DB_NAME || 'memo_app',
  charset: 'utf8mb4',
  timezone: '+08:00'
};

// 创建连接池
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 初始化数据库和表
async function initDatabase() {
  try {
    // 创建数据库（如果不存在）
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      charset: dbConfig.charset
    });

    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await connection.end();

    // 创建用户表
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
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
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS memos (
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

    console.log('数据库和表初始化完成');
  } catch (error) {
    console.error('数据库初始化失败:', error);
    throw error;
  }
}

// 获取数据库连接
function getConnection() {
  return pool;
}

module.exports = {
  initDatabase,
  getConnection
};
