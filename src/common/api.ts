/**
 * 测试API连接
 * @param model - 模型名称
 * @param key - API密钥
 * @returns Promise<boolean> - 连接是否成功
 */
export async function testConnection(model: string, key: string): Promise<boolean> {
  try {
    // 检查是否为OpenAI模型
    if (model.startsWith('openai/')) {
      return await testOpenAIConnection(key);
    }
    
    // 其他模型暂时返回false
    return false;
  } catch (error) {
    console.error('Connection test failed:', error);
    return false;
  }
}

/**
 * 测试OpenAI API连接
 * @param key - OpenAI API密钥
 * @returns Promise<boolean> - 连接是否成功
 */
async function testOpenAIConnection(key: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8秒超时

    const response = await fetch('https://api.openai.com/v1/models', {
      method: 'HEAD',
      headers: {
        'Authorization': `Bearer ${key}`,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    
    return response.status === 200;
  } catch (error) {
    console.error('OpenAI connection test failed:', error);
    return false;
  }
}
