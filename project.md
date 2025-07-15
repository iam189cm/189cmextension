# QuickTranslate AI 翻译 – 需求确认记录
*版本：v0.1 – 2025‑07‑15*

## 1. 目标与范围
- **MVP**：为 Chrome / Edge (Manifest V3) 提供英文 → 中文即时翻译，支持整页和选中文本两种场景
- **长期**：支持多语言互译、后台计费、更多模型

## 2. 技术选型
| 项目 | 结论 |
|------|------|
| 浏览器 | Chrome 117+ / Edge 117+ |
| Manifest | V3 |
| 主要技术 | TypeScript, React (popup & options), TailwindCSS, Vite |
| 模块化 | 每个功能独立目录，单一职责，≤300 行/文件 |

## 3. AI 模型与远程配置
- 默认内置供应商：OpenAI、OpenRouter、Anthropic  
- 远程 `models.json` 放置 GitHub Raw；插件启动时异步拉取，失败 fallback 本地列表  
- 模型参数可热更新，无需重新发布

## 4. API Key 存储
- 初次未填写 Key 时自动跳转设置页  
- 存储位置：`chrome.storage.local`（浏览器自带加密，**仅本机，不同步**）  
- 支持多个 Key，自动根据供应商匹配

## 5. 翻译功能
| 场景 | 行为 | 呈现 |
|------|------|------|
| 整页 | 翻译英文节点 → 中文 | 中文插入原文下方，默认折叠；点击展开 |
| 选中文本 | Shift+Alt+T 或浮标点击 | 中文插入原文下方 |
| 动态 DOM | MutationObserver 节流 300 ms；`data-qt` 标记去重 |
| 多媒体 | 翻译 `alt`、`title`；iframe / Shadow DOM 递归处理 |
| 缓存 | IndexedDB MruCache 24 h / 1 MB，URL+hash 作为键 |

## 6. UI 与交互
- **Popup**：256 × 256 px，黑底，系统字体，单页完成所有设置  
- 主题：暗色主题  
- 错误提示：右上角 toast，可点击查看详情  
- 快捷键：默认 Shift+Alt+T，后续可自定义  

## 7. 资源
- 名称：**QuickTranslate AI 翻译**  
- 图标：临时字母 QT（16, 32, 48, 128 px）  
- License：MIT  
- 隐私声明：仅本地存储，不上传任何翻译数据  

## 8. 里程碑
1. 🏗 **架构与脚手架**（Vite+TS）：2 d  
2. 🔌 **核心逻辑**（content script + API adapter）：3 d  
3. 🖼 **UI**（popup/options）：2 d  
4. 🔄 **动态 DOM & 缓存**：3 d  
5. 🧪 **测试 & 打包**：2 d  
6. 🚀 **发布**（Chrome Web Store 内部测试）：1 d  

---
> **备注**：商业化方案、扩展功能（自定义快捷键、多语言、同步 Key、后台计费等）待 MVP 上线后再评估。

