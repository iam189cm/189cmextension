import { TranslationRequest, TranslationResponse, TranslationError, TranslationProvider } from '../types';
import { OpenAIProvider } from '../models/openai';
import { AnthropicProvider } from '../models/anthropic';
import { OpenRouterProvider } from '../models/openrouter';

// 供应商实例
const providers = {
  openai: new OpenAIProvider(),
  anthropic: new AnthropicProvider(),
  openrouter: new OpenRouterProvider(),
};

/**
 * 获取供应商类型
 */
function getProviderType(model: string): TranslationProvider {
  if (model.startsWith('openai/')) return 'openai';
  if (model.startsWith('anthropic/')) return 'anthropic';
  if (model.startsWith('openrouter/')) return 'openrouter';
  throw new Error(`未知的模型供应商: ${model}`);
}

/**
 * 翻译文本
 */
export async function translateText(request: TranslationRequest): Promise<TranslationResponse> {
  const providerType = getProviderType(request.model);
  const provider = providers[providerType];
  
  if (!provider) {
    throw new Error(`不支持的供应商: ${providerType}`);
  }
  
  return await provider.translate(request);
}

/**
 * 测试API连接
 */
export async function testConnection(model: string, key: string): Promise<boolean> {
  try {
    const providerType = getProviderType(model);
    const provider = providers[providerType];
    
    if (!provider) {
      return false;
    }
    
    return await provider.testConnection(key);
  } catch (error) {
    console.error('Connection test failed:', error);
    return false;
  }
}


