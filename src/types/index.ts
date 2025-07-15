// 翻译供应商类型
export type TranslationProvider = 'openai' | 'anthropic' | 'openrouter';

// 翻译模型配置
export interface ModelConfig {
  id: string;
  name: string;
  provider: TranslationProvider;
  maxTokens?: number;
  temperature?: number;
  enabled: boolean;
}

// API 密钥配置
export interface ApiKeyConfig {
  provider: TranslationProvider;
  key: string;
  enabled: boolean;
}

// 翻译请求参数
export interface TranslationRequest {
  text: string;
  from: string;
  to: string;
  model: string;
  apiKey: string;
}

// 翻译响应
export interface TranslationResponse {
  translatedText: string;
  originalText: string;
  from: string;
  to: string;
  model: string;
  timestamp: number;
}

// 翻译错误
export interface TranslationError {
  code: string;
  message: string;
  details?: any;
}

// 缓存项
export interface CacheItem {
  key: string;
  value: TranslationResponse;
  timestamp: number;
  expiry: number;
}

// 远程模型配置
export interface RemoteModelConfig {
  models: ModelConfig[];
  lastUpdated: number;
  version: string;
}

// 扩展设置
export interface ExtensionSettings {
  apiKeys: ApiKeyConfig[];
  selectedModel: string;
  autoTranslate: boolean;
  showOriginal: boolean;
  cacheEnabled: boolean;
  theme: 'light' | 'dark' | 'system';
}

// 消息类型
export interface Message {
  type: 'translate' | 'test_connection' | 'get_settings' | 'update_settings' | 'toggle_translation';
  data?: any;
}

// 翻译状态
export type TranslationStatus = 'idle' | 'translating' | 'success' | 'error';

// DOM 节点翻译状态
export interface NodeTranslationState {
  element: HTMLElement;
  originalText: string;
  translatedText?: string;
  status: TranslationStatus;
  hash: string;
}

// 翻译上下文
export interface TranslationContext {
  url: string;
  title: string;
  selectedText?: string;
  isFullPage: boolean;
} 