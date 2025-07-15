import { TranslationRequest, TranslationResponse, TranslationError } from '../types';

export class AnthropicProvider {
  private baseUrl = 'https://api.anthropic.com/v1';

  /**
   * 翻译文本
   */
  async translate(request: TranslationRequest): Promise<TranslationResponse> {
    const { text, from, to, model, apiKey } = request;
    
    const prompt = this.buildTranslationPrompt(text, from, to);
    
    try {
      const response = await fetch(`${this.baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: model.replace('anthropic/', ''),
          max_tokens: 2000,
          temperature: 0.3,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const translatedText = data.content[0]?.text?.trim();

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
      const response = await fetch(`${this.baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 10,
          messages: [
            {
              role: 'user',
              content: 'Hello'
            }
          ],
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Anthropic connection test failed:', error);
      return false;
    }
  }

  /**
   * 构建翻译提示词
   */
  private buildTranslationPrompt(text: string, from: string, to: string): string {
    const fromLang = from === 'en' ? '英文' : from === 'zh' ? '中文' : from;
    const toLang = to === 'en' ? '英文' : to === 'zh' ? '中文' : to;
    
    return `请将以下${fromLang}文本翻译成${toLang}，只返回翻译结果，不要添加任何解释：

${text}`;
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
    
    if (error.message?.includes('credit')) {
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
