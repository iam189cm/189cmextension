import { saveKey, loadKey, saveModel, loadModel } from '../common/storage.js';
import { testConnection } from '../common/api.js';

// 可用模型列表
const MODELS = ['openai/gpt-3.5-turbo', 'openai/gpt-4o-mini'];

/**
 * 创建并渲染UI元素
 */
function renderUI(): void {
  const container = document.body;
  
  // 创建API Key输入框
  const apiKeyLabel = document.createElement('label');
  apiKeyLabel.textContent = 'API Key:';
  apiKeyLabel.style.display = 'block';
  apiKeyLabel.style.marginBottom = '5px';
  
  const apiKeyInput = document.createElement('input');
  apiKeyInput.id = 'apiKey';
  apiKeyInput.type = 'password';
  apiKeyInput.placeholder = '请输入API密钥';
  apiKeyInput.style.width = '100%';
  apiKeyInput.style.marginBottom = '10px';
  apiKeyInput.style.padding = '5px';
  
  // 创建模型选择下拉框
  const modelLabel = document.createElement('label');
  modelLabel.textContent = '模型:';
  modelLabel.style.display = 'block';
  modelLabel.style.marginBottom = '5px';
  
  const modelSelect = document.createElement('select');
  modelSelect.id = 'model';
  modelSelect.style.width = '100%';
  modelSelect.style.marginBottom = '10px';
  modelSelect.style.padding = '5px';
  
  // 添加模型选项
  MODELS.forEach(model => {
    const option = document.createElement('option');
    option.value = model;
    option.textContent = model;
    modelSelect.appendChild(option);
  });
  
  // 创建按钮容器
  const buttonContainer = document.createElement('div');
  buttonContainer.style.display = 'flex';
  buttonContainer.style.gap = '10px';
  
  // 创建保存按钮
  const saveButton = document.createElement('button');
  saveButton.id = 'save';
  saveButton.textContent = 'Save';
  saveButton.style.flex = '1';
  saveButton.style.padding = '8px';
  saveButton.style.backgroundColor = '#4CAF50';
  saveButton.style.color = 'white';
  saveButton.style.border = 'none';
  saveButton.style.borderRadius = '4px';
  saveButton.style.cursor = 'pointer';
  
  // 创建测试按钮
  const testButton = document.createElement('button');
  testButton.id = 'test';
  testButton.textContent = 'Test';
  testButton.style.flex = '1';
  testButton.style.padding = '8px';
  testButton.style.backgroundColor = '#2196F3';
  testButton.style.color = 'white';
  testButton.style.border = 'none';
  testButton.style.borderRadius = '4px';
  testButton.style.cursor = 'pointer';
  
  // 添加元素到容器
  buttonContainer.appendChild(saveButton);
  buttonContainer.appendChild(testButton);
  
  container.appendChild(apiKeyLabel);
  container.appendChild(apiKeyInput);
  container.appendChild(modelLabel);
  container.appendChild(modelSelect);
  container.appendChild(buttonContainer);
  
  // 设置容器样式
  container.style.padding = '15px';
  container.style.minWidth = '300px';
  container.style.fontFamily = 'Arial, sans-serif';
}

/**
 * 加载保存的设置
 */
async function loadSettings(): Promise<void> {
  try {
    const [savedKey, savedModel] = await Promise.all([
      loadKey(),
      loadModel()
    ]);
    
    const apiKeyInput = document.getElementById('apiKey') as HTMLInputElement;
    const modelSelect = document.getElementById('model') as HTMLSelectElement;
    
    if (savedKey) {
      apiKeyInput.value = savedKey;
    }
    
    if (savedModel && MODELS.includes(savedModel)) {
      modelSelect.value = savedModel;
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
}

/**
 * 保存设置
 */
async function handleSave(): Promise<void> {
  try {
    const apiKeyInput = document.getElementById('apiKey') as HTMLInputElement;
    const modelSelect = document.getElementById('model') as HTMLSelectElement;
    
    const key = apiKeyInput.value.trim();
    const model = modelSelect.value;
    
    if (!key) {
      alert('请输入API密钥');
      return;
    }
    
    await Promise.all([
      saveKey(key),
      saveModel(model)
    ]);
    
    alert('设置已保存');
  } catch (error) {
    console.error('Failed to save settings:', error);
    alert('保存失败');
  }
}

/**
 * 测试连接
 */
async function handleTest(): Promise<void> {
  const testButton = document.getElementById('test') as HTMLButtonElement;
  const apiKeyInput = document.getElementById('apiKey') as HTMLInputElement;
  const modelSelect = document.getElementById('model') as HTMLSelectElement;
  
  const key = apiKeyInput.value.trim();
  const model = modelSelect.value;
  
  if (!key) {
    alert('请先输入API密钥');
    return;
  }
  
  // 禁用测试按钮
  testButton.disabled = true;
  testButton.textContent = '测试中...';
  
  try {
    const isConnected = await testConnection(model, key);
    
    if (isConnected) {
      alert('✅ 连接成功');
    } else {
      alert('❌ 连接失败');
    }
  } catch (error) {
    console.error('Connection test failed:', error);
    alert('❌ 测试失败');
  } finally {
    // 恢复测试按钮
    testButton.disabled = false;
    testButton.textContent = 'Test';
  }
}

/**
 * 初始化事件监听器
 */
function initEventListeners(): void {
  const saveButton = document.getElementById('save') as HTMLButtonElement;
  const testButton = document.getElementById('test') as HTMLButtonElement;
  
  saveButton.addEventListener('click', handleSave);
  testButton.addEventListener('click', handleTest);
}

/**
 * 初始化应用
 */
async function init(): Promise<void> {
  renderUI();
  await loadSettings();
  initEventListeners();
}

// 当DOM加载完成时初始化应用
document.addEventListener('DOMContentLoaded', init);
