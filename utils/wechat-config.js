// 微信小程序配置管理工具

/**
 * 获取微信小程序配置步骤说明
 */
function getWechatConfigGuide() {
  return {
    title: '微信小程序配置指南',
    steps: [
      {
        step: 1,
        title: '登录微信公众平台',
        description: '访问 https://mp.weixin.qq.com/',
        action: '使用小程序管理员微信扫码登录'
      },
      {
        step: 2,
        title: '获取AppID',
        description: '在小程序管理后台找到AppID',
        path: '开发 -> 开发管理 -> 开发设置 -> 开发者ID',
        note: 'AppID是小程序的唯一标识'
      },
      {
        step: 3,
        title: '获取AppSecret',
        description: '生成或查看AppSecret',
        path: '开发 -> 开发管理 -> 开发设置 -> 开发者密码(AppSecret)',
        warning: 'AppSecret非常重要，请妥善保管，不要泄露'
      },
      {
        step: 4,
        title: '配置服务器域名',
        description: '将您的API服务器域名添加到request合法域名',
        path: '开发 -> 开发管理 -> 开发设置 -> 服务器域名',
        example: 'https://vgsarkerfnri.sealosbja.site'
      },
      {
        step: 5,
        title: '更新.env文件',
        description: '将获取到的AppID和AppSecret配置到环境变量',
        example: {
          'WECHAT_APPID': 'wx1234567890abcdef',
          'WECHAT_SECRET': 'abcdef1234567890abcdef1234567890'
        }
      }
    ],
    security: {
      title: '安全注意事项',
      points: [
        'AppSecret绝对不能暴露在前端代码中',
        'AppSecret只能在服务器端使用',
        '定期更换AppSecret以提高安全性',
        '不要将AppSecret提交到代码仓库',
        '使用环境变量管理敏感配置'
      ]
    }
  };
}

/**
 * 验证微信配置是否完整
 */
function validateWechatConfig() {
  const appid = process.env.WECHAT_APPID;
  const secret = process.env.WECHAT_SECRET;
  
  const result = {
    valid: false,
    errors: [],
    warnings: []
  };
  
  if (!appid) {
    result.errors.push('缺少WECHAT_APPID配置');
  } else if (!appid.startsWith('wx') || appid.length !== 18) {
    result.warnings.push('WECHAT_APPID格式可能不正确（应该以wx开头，长度为18位）');
  }
  
  if (!secret) {
    result.errors.push('缺少WECHAT_SECRET配置');
  } else if (secret.length !== 32) {
    result.warnings.push('WECHAT_SECRET长度可能不正确（通常为32位）');
  }
  
  result.valid = result.errors.length === 0;
  
  return result;
}

/**
 * 测试微信API连接
 */
async function testWechatAPI() {
  const validation = validateWechatConfig();
  
  if (!validation.valid) {
    return {
      success: false,
      error: '微信配置不完整',
      details: validation
    };
  }
  
  try {
    // 使用一个无效的code测试API连接
    const testCode = 'test_invalid_code';
    const appid = process.env.WECHAT_APPID;
    const secret = process.env.WECHAT_SECRET;
    
    const url = `https://api.weixin.qq.com/sns/jscode2session`;
    const params = new URLSearchParams({
      appid,
      secret,
      js_code: testCode,
      grant_type: 'authorization_code'
    });
    
    const response = await fetch(`${url}?${params}`, {
      method: 'GET',
      timeout: 5000
    });
    
    const data = await response.json();
    
    // 如果返回40029错误（code无效），说明API连接正常，配置正确
    if (data.errcode === 40029) {
      return {
        success: true,
        message: '微信API连接正常，配置正确',
        note: '返回code无效错误是正常的，因为使用了测试code'
      };
    }
    
    // 其他错误可能是配置问题
    return {
      success: false,
      error: `微信API配置错误: ${data.errmsg}`,
      errcode: data.errcode
    };
    
  } catch (error) {
    return {
      success: false,
      error: '无法连接到微信API',
      details: error.message
    };
  }
}

module.exports = {
  getWechatConfigGuide,
  validateWechatConfig,
  testWechatAPI
};
