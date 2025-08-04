const { getConnection } = require('../config/database');

class User {
  constructor(data) {
    this.id = data.id;
    this.userId = data.user_id;
    this.userType = data.user_type;
    this.openid = data.openid;
    this.sessionKey = data.session_key;
    this.nickname = data.nickname;
    this.avatarUrl = data.avatar_url;
    this.memoCount = data.memo_count;
    this.lastActiveTime = data.last_active_time;
    this.createdTime = data.created_time;
    this.updatedTime = data.updated_time;
  }

  // 格式化时间为ISO 8601格式
  static formatDateTime(dateTime) {
    if (!dateTime) return null;
    return new Date(dateTime).toISOString();
  }

  // 将数据库记录转换为API响应格式
  static formatUser(row) {
    return {
      userId: row.user_id,
      userType: row.user_type,
      openid: row.openid,
      nickname: row.nickname,
      avatarUrl: row.avatar_url,
      memoCount: row.memo_count,
      createdTime: this.formatDateTime(row.created_time),
      lastActiveTime: this.formatDateTime(row.last_active_time)
    };
  }

  // 解析用户ID获取用户类型
  static parseUserType(userId) {
    if (!userId) return null;
    const parts = userId.split('_');
    return parts[0] || 'other';
  }

  // 验证用户ID格式
  static validateUserId(userId) {
    if (!userId || typeof userId !== 'string') {
      return false;
    }
    // 支持格式: wx_xxx, h5_xxx, app_xxx, other_xxx
    return /^(wx_|h5_|app_|other_).+/.test(userId);
  }

  // 自动注册或更新用户
  static async autoRegister(userId, userInfo = {}) {
    const connection = getConnection();
    
    if (!this.validateUserId(userId)) {
      throw new Error('无效的用户ID格式');
    }

    const userType = this.parseUserType(userId);
    const { nickname, avatarUrl, openid, sessionKey } = userInfo;

    try {
      // 插入或更新用户记录
      await connection.execute(`
        INSERT INTO users (user_id, user_type, openid, session_key, nickname, avatar_url, last_active_time)
        VALUES (?, ?, ?, ?, ?, ?, NOW())
        ON DUPLICATE KEY UPDATE
          nickname = COALESCE(VALUES(nickname), nickname),
          avatar_url = COALESCE(VALUES(avatar_url), avatar_url),
          openid = COALESCE(VALUES(openid), openid),
          session_key = COALESCE(VALUES(session_key), session_key),
          last_active_time = NOW()
      `, [userId, userType, openid || null, sessionKey || null, nickname || null, avatarUrl || null]);

      return await this.findByUserId(userId);
    } catch (error) {
      console.error('用户自动注册失败:', error);
      throw error;
    }
  }

  // 根据用户ID查找用户
  static async findByUserId(userId) {
    const connection = getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM users WHERE user_id = ?',
      [userId]
    );
    
    if (rows.length === 0) {
      return null;
    }
    
    return this.formatUser(rows[0]);
  }

  // 更新用户信息
  static async updateProfile(userId, updateData) {
    const connection = getConnection();
    const { nickname, avatarUrl } = updateData;

    const [result] = await connection.execute(`
      UPDATE users SET
        nickname = ?,
        avatar_url = ?,
        updated_time = NOW()
      WHERE user_id = ?
    `, [nickname, avatarUrl, userId]);

    if (result.affectedRows === 0) {
      return null;
    }

    return await this.findByUserId(userId);
  }

  // 更新用户活跃时间
  static async updateActiveTime(userId) {
    const connection = getConnection();
    await connection.execute(
      'UPDATE users SET last_active_time = NOW() WHERE user_id = ?',
      [userId]
    );
  }

  // 更新用户备忘录数量
  static async updateMemoCount(userId) {
    const connection = getConnection();
    await connection.execute(`
      UPDATE users SET memo_count = (
        SELECT COUNT(*) FROM memos WHERE user_id = ?
      ) WHERE user_id = ?
    `, [userId, userId]);
  }

  // 微信登录处理
  static async wechatLogin(code, userInfo = {}) {
    try {
      // 调用微信API获取openid和session_key
      const wechatData = await this.callWechatAPI(code);

      const userId = `wx_${wechatData.openid}`;
      const userData = {
        openid: wechatData.openid,
        sessionKey: wechatData.sessionKey,
        ...userInfo
      };

      return await this.autoRegister(userId, userData);
    } catch (error) {
      console.error('微信登录失败:', error);
      throw new Error(`微信登录失败: ${error.message}`);
    }
  }

  // 调用微信API获取openid
  static async callWechatAPI(code) {
    const WECHAT_APPID = process.env.WECHAT_APPID;
    const WECHAT_SECRET = process.env.WECHAT_SECRET;

    if (!WECHAT_APPID || !WECHAT_SECRET) {
      throw new Error('微信配置未设置，请在.env文件中配置WECHAT_APPID和WECHAT_SECRET');
    }

    console.log('调用微信API获取openid...', { code: code.substring(0, 10) + '...' });

    try {
      const url = `https://api.weixin.qq.com/sns/jscode2session`;
      const params = new URLSearchParams({
        appid: WECHAT_APPID,
        secret: WECHAT_SECRET,
        js_code: code,
        grant_type: 'authorization_code'
      });

      const response = await fetch(`${url}?${params}`, {
        method: 'GET',
        timeout: 10000 // 10秒超时
      });

      if (!response.ok) {
        throw new Error(`HTTP错误: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('微信API响应:', {
        errcode: data.errcode,
        openid: data.openid ? data.openid.substring(0, 10) + '...' : undefined
      });

      if (data.errcode) {
        const errorMessages = {
          40013: 'AppID无效',
          40125: 'AppSecret无效',
          40029: 'code无效',
          45011: 'API调用太频繁，请稍后再试',
          40226: '高风险等级用户，小程序登录拦截'
        };
        const errorMsg = errorMessages[data.errcode] || data.errmsg || '未知错误';
        throw new Error(`微信API错误(${data.errcode}): ${errorMsg}`);
      }

      if (!data.openid) {
        throw new Error('微信API返回数据异常：缺少openid');
      }

      return {
        openid: data.openid,
        sessionKey: data.session_key,
        unionid: data.unionid // 如果有的话
      };
    } catch (error) {
      console.error('调用微信API失败:', error);
      throw error;
    }
  }

  // 获取用户统计信息
  static async getUserStats(userId) {
    const connection = getConnection();
    const [rows] = await connection.execute(`
      SELECT 
        COUNT(*) as totalMemos,
        COUNT(CASE WHEN status = 1 THEN 1 END) as completedMemos,
        COUNT(CASE WHEN status = 0 THEN 1 END) as pendingMemos,
        COUNT(CASE WHEN priority = 2 THEN 1 END) as urgentMemos
      FROM memos 
      WHERE user_id = ?
    `, [userId]);

    return rows[0] || {
      totalMemos: 0,
      completedMemos: 0,
      pendingMemos: 0,
      urgentMemos: 0
    };
  }
}

module.exports = User;
