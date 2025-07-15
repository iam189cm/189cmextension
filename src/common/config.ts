import { ModelConfig, RemoteModelConfig } from '../types';
import browser from 'webextension-polyfill';

// 远程配置URL
const REMOTE_CONFIG_URL = 'https://raw.githubusercontent.com/iam189cm/quicktranslate-config/main/models.json';

// 默认模型配置（本地fallback）
const DEFAULT_MODELS: ModelConfig[] = [
  {
    id: 'openai/gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'openai',
    maxTokens: 4096,
    temperature: 0.3,
    enabled: true,
  },
  {
    id: 'openai/gpt-4o',
    name: 'GPT-4o',
    provider: 'openai',
    maxTokens: 4096,
    temperature: 0.3,
    enabled: true,
  },
  {
    id: 'anthropic/claude-3-haiku-20240307',
    name: 'Claude 3 Haiku',
    provider: 'anthropic',
    maxTokens: 4096,
    temperature: 0.3,
    enabled: true,
  },
  {
    id: 'anthropic/claude-3-5-sonnet-20241022',
    name: 'Claude 3.5 Sonnet',
    provider: 'anthropic',
    maxTokens: 4096,
    temperature: 0.3,
    enabled: true,
  },
  {
    id: 'openrouter/openai/gpt-4o-mini',
    name: 'GPT-4o Mini (OpenRouter)',
    provider: 'openrouter',
    maxTokens: 4096,
    temperature: 0.3,
    enabled: true,
  },
  {
    id: 'openrouter/anthropic/claude-3-haiku',
    name: 'Claude 3 Haiku (OpenRouter)',
    provider: 'openrouter',
    maxTokens: 4096,
    temperature: 0.3,
    enabled: true,
  },
];

// 缓存键
const CACHE_KEY = 'qt_remote_config';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24小时

/**
 * 获取模型配置列表
 */
export async function getModelConfigs(): Promise<ModelConfig[]> {
  try {
    // 先尝试从缓存获取
    const cached = await getCachedConfig();
    if (cached && !isConfigExpired(cached)) {
      return cached.models;
    }

    // 尝试从远程获取
    const remoteConfig = await fetchRemoteConfig();
    if (remoteConfig) {
      await cacheConfig(remoteConfig);
      return remoteConfig.models;
    }

    // 如果远程获取失败，使用缓存或默认配置
    return cached ? cached.models : DEFAULT_MODELS;
  } catch (error) {
    console.error('获取模型配置失败:', error);
    
    // 尝试使用缓存
    const cached = await getCachedConfig();
    return cached ? cached.models : DEFAULT_MODELS;
  }
}

/**
 * 从远程获取配置
 */
async function fetchRemoteConfig(): Promise<RemoteModelConfig | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时

    const response = await fetch(REMOTE_CONFIG_URL, {
      signal: controller.signal,
      headers: {
        'Cache-Control': 'no-cache',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const config = await response.json();
    
    // 验证配置格式
    if (!config.models || !Array.isArray(config.models)) {
      throw new Error('无效的配置格式');
    }

    return {
      models: config.models,
      lastUpdated: Date.now(),
      version: config.version || '1.0.0',
    };
  } catch (error) {
    console.error('获取远程配置失败:', error);
    return null;
  }
}

/**
 * 从缓存获取配置
 */
async function getCachedConfig(): Promise<RemoteModelConfig | null> {
  try {
    const result = await browser.storage.local.get(CACHE_KEY);
    return (result[CACHE_KEY] as RemoteModelConfig) || null;
  } catch (error) {
    console.error('获取缓存配置失败:', error);
    return null;
  }
}

/**
 * 缓存配置
 */
async function cacheConfig(config: RemoteModelConfig): Promise<void> {
  try {
    await browser.storage.local.set({
      [CACHE_KEY]: config,
    });
  } catch (error) {
    console.error('缓存配置失败:', error);
  }
}

/**
 * 检查配置是否过期
 */
function isConfigExpired(config: RemoteModelConfig): boolean {
  return Date.now() - config.lastUpdated > CACHE_EXPIRY;
}

/**
 * 强制刷新配置
 */
export async function refreshModelConfigs(): Promise<ModelConfig[]> {
  try {
    const remoteConfig = await fetchRemoteConfig();
    if (remoteConfig) {
      await cacheConfig(remoteConfig);
      return remoteConfig.models;
    }
    
    return DEFAULT_MODELS;
  } catch (error) {
    console.error('刷新配置失败:', error);
    return DEFAULT_MODELS;
  }
}

/**
 * 获取默认模型配置
 */
export function getDefaultModels(): ModelConfig[] {
  return DEFAULT_MODELS;
}
