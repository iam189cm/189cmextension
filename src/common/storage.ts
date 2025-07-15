import browser from 'webextension-polyfill';

/**
 * 保存API密钥到本地存储
 * @param key - 要保存的API密钥
 * @returns Promise<void>
 */
export async function saveKey(key: string): Promise<void> {
  try {
    await browser.storage.local.set({ apiKey: key });
  } catch (error) {
    console.error('Failed to save API key:', error);
    throw error;
  }
}

/**
 * 从本地存储加载API密钥
 * @returns Promise<string | undefined> - 返回保存的API密钥，如果不存在则返回undefined
 */
export async function loadKey(): Promise<string | undefined> {
  try {
    const result = await browser.storage.local.get('apiKey');
    return result.apiKey as string | undefined;
  } catch (error) {
    console.error('Failed to load API key:', error);
    throw error;
  }
}

/**
 * 保存选中的模型到本地存储
 * @param model - 要保存的模型名称
 * @returns Promise<void>
 */
export async function saveModel(model: string): Promise<void> {
  try {
    await browser.storage.local.set({ selectedModel: model });
  } catch (error) {
    console.error('Failed to save model:', error);
    throw error;
  }
}

/**
 * 从本地存储加载选中的模型
 * @returns Promise<string | undefined> - 返回保存的模型名称，如果不存在则返回undefined
 */
export async function loadModel(): Promise<string | undefined> {
  try {
    const result = await browser.storage.local.get('selectedModel');
    return result.selectedModel as string | undefined;
  } catch (error) {
    console.error('Failed to load model:', error);
    throw error;
  }
}
