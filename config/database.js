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

    // 创建备忘录表
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS memos (
        id INT PRIMARY KEY AUTO_INCREMENT COMMENT '备忘录ID',
        title VARCHAR(50) NOT NULL COMMENT '标题',
        content TEXT NOT NULL COMMENT '内容',
        create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
        update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
        INDEX idx_update_time (update_time DESC)
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
