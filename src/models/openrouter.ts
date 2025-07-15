import { TranslationRequest, TranslationResponse, TranslationError } from '../types';

export class OpenRouterProvider {
  private baseUrl = 'https://openrouter.ai/api/v1';

  /**
   * 翻译文本
   */
  async translate(request: TranslationRequest): Promise<TranslationResponse> {
    const { text, from, to, model, apiKey } = request;
    
    const prompt = this.buildTranslationPrompt(text, from, to);
    
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://quicktranslate.extension',
          'X-Title': 'QuickTranslate AI 翻译',
        },
        body: JSON.stringify({
          model: model.replace('openrouter/', ''),
          messages: [
            {
              role: 'system',
              content: '你是一个专业的翻译助手，请直接返回翻译结果，不要添加任何解释或格式。'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const translatedText = data.choices[0]?.message?.content?.trim();

      if (!translatedText) {
        throw new Error('翻译响应为空');
      }

      return {
        translatedText,
        originalText: text,
        from,
        to,
        model,
        timestamp: Date.now(),
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * 测试API连接
   */
  async testConnection(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://quicktranslate.extension',
        },
      });

      return response.ok;
    } catch (error) {
      console.error('OpenRouter connection test failed:', error);
      return false;
    }
  }

  /**
   * 构建翻译提示词
   */
  private buildTranslationPrompt(text: string, from: string, to: string): string {
    const fromLang = from === 'en' ? '英文' : from === 'zh' ? '中文' : from;
    const toLang = to === 'en' ? '英文' : to === 'zh' ? '中文' : to;
    
    return `请将以下${fromLang}文本翻译成${toLang}：

${text}

请直接返回翻译结果，不要添加任何解释。`;
  }

  /**
   * 处理错误
   */
  private handleError(error: any): TranslationError {
    if (error.message?.includes('401')) {
      return {
        code: 'INVALID_API_KEY',
        message: 'API 密钥无效或已过期',
        details: error,
      };
    }
    
    if (error.message?.includes('429')) {
      return {
        code: 'RATE_LIMIT',
        message: '请求频率过高，请稍后重试',
        details: error,
      };
    }
    
    if (error.message?.includes('insufficient')) {
      return {
        code: 'QUOTA_EXCEEDED',
        message: 'API 配额已用完',
        details: error,
      };
    }

    return {
      code: 'UNKNOWN_ERROR',
      message: error.message || '翻译失败',
      details: error,
    };
  }
}
