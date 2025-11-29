import type { Meta, StoryObj } from '@storybook/react';

const README = () => {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>QWS-UI</h1>
      <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem' }}>
        基于 React + TypeScript 的企业级数据管理平台
      </p>

      {/* Badges */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <img src="https://img.shields.io/badge/🤖_AI_Powered-Claude_Code-blue?style=for-the-badge" alt="AI Powered" />
        <img src="https://img.shields.io/badge/license-MIT-green?style=for-the-badge" alt="License" />
        <img src="https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react" alt="React" />
        <img src="https://img.shields.io/badge/TypeScript-5.3-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
      </div>

      <hr style={{ margin: '2rem 0', border: 'none', borderTop: '1px solid #ddd' }} />

      {/* Repository Links */}
      <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '1rem' }}>🌍 仓库镜像</h2>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <a href="https://gitee.com/qianwensoft/qws-ui" target="_blank" rel="noopener noreferrer">
          <img src="https://img.shields.io/badge/Gitee-qws--ui-C71D23?style=for-the-badge&logo=gitee" alt="Gitee" />
        </a>
        <a href="https://github.com/qianwensoft/qws-ui" target="_blank" rel="noopener noreferrer">
          <img src="https://img.shields.io/badge/GitHub-qws--ui-181717?style=for-the-badge&logo=github" alt="GitHub" />
        </a>
      </div>

      <div style={{ backgroundColor: '#f5f5f5', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <p style={{ margin: '0.5rem 0', fontSize: '1rem' }}>
          <strong>仓库地址：</strong>
        </p>
        <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
          <li>
            🔹 <strong>Gitee</strong>: <a href="https://gitee.com/qianwensoft/qws-ui" target="_blank" rel="noopener noreferrer" style={{ color: '#C71D23' }}>
              https://gitee.com/qianwensoft/qws-ui
            </a>
          </li>
          <li>
            🔹 <strong>GitHub</strong>: <a href="https://github.com/qianwensoft/qws-ui" target="_blank" rel="noopener noreferrer" style={{ color: '#181717' }}>
              https://github.com/qianwensoft/qws-ui
            </a>
          </li>
        </ul>
        <p style={{ margin: '1rem 0 0.5rem', fontSize: '1rem' }}>
          <strong>在线文档：</strong>
        </p>
        <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
          <li>
            📖 <strong>Gitee Pages</strong>: <a href="https://qianwensoft.gitee.io/qws-ui" target="_blank" rel="noopener noreferrer" style={{ color: '#C71D23' }}>
              https://qianwensoft.gitee.io/qws-ui
            </a>
          </li>
          <li>
            📖 <strong>GitHub Pages</strong>: <a href="https://qianwensoft.github.io/qws-ui" target="_blank" rel="noopener noreferrer" style={{ color: '#181717' }}>
              https://qianwensoft.github.io/qws-ui
            </a>
          </li>
        </ul>
      </div>

      <hr style={{ margin: '2rem 0', border: 'none', borderTop: '1px solid #ddd' }} />

      {/* About Project */}
      <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '1rem' }}>🤖 关于本项目</h2>
      <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>AI 编程实践</h3>
      <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>
        <strong>本项目是 AI 辅助编程的完整实践案例</strong>，由 <a href="https://claude.ai/code" target="_blank" rel="noopener noreferrer" style={{ color: '#5865F2' }}><strong>Claude Code</strong></a> (Anthropic 的 AI 编程助手) 全程参与开发。
      </p>
      <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>
        这不仅仅是一个组件库，更是一次探索 <strong>AI 如何改变软件开发方式</strong> 的实验：
      </p>
      <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
        <li>🎯 <strong>需求到代码</strong>：从业务需求直接转化为可运行的代码</li>
        <li>🏗️ <strong>架构设计</strong>：AI 协助完成整体架构设计和技术选型</li>
        <li>✍️ <strong>代码实现</strong>：核心组件、测试用例、文档全部由 AI 生成</li>
        <li>🔄 <strong>迭代优化</strong>：通过对话不断优化代码质量和功能</li>
        <li>📚 <strong>文档完善</strong>：自动生成详细的技术文档和使用指南</li>
      </ul>

      <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.5rem' }}>成果展示</h3>
      <div style={{ backgroundColor: '#f0f9ff', padding: '1.5rem', borderRadius: '8px', marginBottom: '1rem' }}>
        <p style={{ margin: '0.3rem 0' }}><strong>代码量统计</strong>:</p>
        <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
          <li>AdvancedTable: ~2,300 行 TypeScript</li>
          <li>PrintDesigner: ~4,200 行 TypeScript</li>
          <li>测试用例: 84 个测试，全部通过</li>
          <li>文档: 6 个完整的 Markdown 文档</li>
        </ul>
        <p style={{ margin: '1rem 0 0.3rem' }}><strong>开发数据</strong>:</p>
        <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
          <li>开发时间: 约 5 天（从零到完整项目）</li>
          <li>AI 参与度: 约 95%（包括代码、测试、文档）</li>
          <li>代码质量: 通过所有测试，零运行时错误</li>
          <li>Token 成本: ~50 USD（约 350 元人民币）</li>
        </ul>
      </div>

      <hr style={{ margin: '2rem 0', border: 'none', borderTop: '1px solid #ddd' }} />

      {/* Core Components */}
      <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '1rem' }}>🔷 核心组件</h2>

      <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>1. AdvancedTable - 高级表格组件</h3>
      <p style={{ lineHeight: '1.6', marginBottom: '0.5rem' }}>功能丰富的表格组件，提供类似 Excel 的交互体验：</p>
      <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
        <li>📝 <strong>编辑模式</strong>：单击/双击编辑，支持自动保存</li>
        <li>📋 <strong>Excel 粘贴</strong>：直接粘贴 Excel 数据，自动创建新行</li>
        <li>🔍 <strong>高级过滤</strong>：12种过滤操作符，支持多条件筛选</li>
        <li>📊 <strong>导出功能</strong>：导出到 Excel（支持样式）</li>
        <li>🎯 <strong>列管理</strong>：拖拽排序、调整宽度、显示/隐藏</li>
        <li>📄 <strong>分页导航</strong>：自定义页码和页面大小</li>
        <li>🎨 <strong>样式定制</strong>：斑马纹、交叉高亮、多选单元格</li>
        <li>🛠️ <strong>工具栏</strong>：自定义工具栏按钮</li>
      </ul>

      <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>2. PrintDesigner - 打印设计器</h3>
      <p style={{ lineHeight: '1.6', marginBottom: '0.5rem' }}>可视化打印模板设计器，基于 fabric.js 实现：</p>
      <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
        <li>🖼️ <strong>拖拽设计</strong>：拖拽式设计界面</li>
        <li>📐 <strong>辅助工具</strong>：标尺、网格、对齐辅助线</li>
        <li>🔤 <strong>丰富元素</strong>：文本、图片、条形码、二维码、线条、矩形、表格</li>
        <li>📊 <strong>循环表格</strong>：支持动态数据打印</li>
        <li>📄 <strong>页眉页脚</strong>：独立控制打印</li>
        <li>📏 <strong>纸张支持</strong>：A4、A5、B5、Letter + 自定义尺寸</li>
        <li>🔄 <strong>数据绑定</strong>：{`{{fieldName}}`}，支持计算表达式</li>
        <li>🔍 <strong>精确控制</strong>：缩放控制和精确定位</li>
      </ul>

      <hr style={{ margin: '2rem 0', border: 'none', borderTop: '1px solid #ddd' }} />

      {/* Quick Install */}
      <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '1rem' }}>📦 快速安装</h2>
      <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>作为 shadcn Registry 使用</h3>
      <p style={{ lineHeight: '1.6', marginBottom: '0.5rem' }}>
        在您的项目中的 <code style={{ backgroundColor: '#f5f5f5', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>components.json</code> 文件中添加 QWS-UI registry：
      </p>
      <pre style={{ backgroundColor: '#f5f5f5', padding: '1rem', borderRadius: '8px', overflow: 'auto', marginBottom: '1rem' }}>
{`{
  "registries": {
    "qws": "https://gitee.com/qianwensoft/qws-ui/raw/prd/r"
  }
}`}
      </pre>

      <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>安装组件</h3>
      <p style={{ lineHeight: '1.6', marginBottom: '0.5rem' }}>使用 shadcn CLI 安装 QWS-UI 组件：</p>
      <pre style={{ backgroundColor: '#282c34', color: '#abb2bf', padding: '1rem', borderRadius: '8px', overflow: 'auto' }}>
{`# 安装高级表格组件
npx shadcn@latest add @qws/advanced-table

# 安装打印设计器组件
npx shadcn@latest add @qws/print-designer

# 安装高级表单组件
npx shadcn@latest add @qws/advanced-form`}
      </pre>

      <hr style={{ margin: '2rem 0', border: 'none', borderTop: '1px solid #ddd' }} />

      {/* Tech Stack */}
      <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '1rem' }}>🚀 技术栈</h2>
      <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8', columnCount: 2, columnGap: '2rem' }}>
        <li><strong>框架</strong>: React 18 + TypeScript 5.3</li>
        <li><strong>构建工具</strong>: Vite 5</li>
        <li><strong>UI 框架</strong>: shadcn/ui + Tailwind CSS 4</li>
        <li><strong>表格引擎</strong>: @tanstack/react-table v8</li>
        <li><strong>拖拽</strong>: @dnd-kit</li>
        <li><strong>Canvas</strong>: fabric.js v6</li>
        <li><strong>Excel 导出</strong>: ExcelJS</li>
        <li><strong>图标</strong>: lucide-react</li>
        <li><strong>组件文档</strong>: Storybook 10</li>
        <li><strong>测试</strong>: Vitest + @testing-library/react</li>
      </ul>

      <hr style={{ margin: '2rem 0', border: 'none', borderTop: '1px solid #ddd' }} />

      {/* Documentation */}
      <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '1rem' }}>📖 使用文档</h2>
      <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>
        在左侧导航栏中浏览各个组件的详细文档和示例
      </p>

      <hr style={{ margin: '2rem 0', border: 'none', borderTop: '1px solid #ddd' }} />

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: '3rem', padding: '2rem', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <p style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          🤖 Built with AI • ❤️ Made with Claude Code • 🚀 Powered by React
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <a href="https://gitee.com/qianwensoft/qws-ui" target="_blank" rel="noopener noreferrer">
            <img src="https://img.shields.io/badge/Gitee-qws--ui-C71D23?style=flat-square&logo=gitee" alt="Gitee" />
          </a>
          <a href="https://github.com/qianwensoft/qws-ui" target="_blank" rel="noopener noreferrer">
            <img src="https://img.shields.io/badge/GitHub-qws--ui-181717?style=flat-square&logo=github" alt="GitHub" />
          </a>
          <a href="https://claude.ai/code" target="_blank" rel="noopener noreferrer">
            <img src="https://img.shields.io/badge/Generated_by-Claude_Code-5865F2?style=flat-square" alt="Claude Code" />
          </a>
        </div>
        <p style={{ fontSize: '1rem', marginTop: '1rem', color: '#666' }}>
          <strong>如果觉得这个项目有趣，欢迎 Star ⭐️</strong>
        </p>
        <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', fontStyle: 'italic', color: '#888' }}>
          让 AI 改变软件开发的方式
        </p>
      </div>
    </div>
  );
};

const meta: Meta = {
  title: '开始/项目概览',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <README />,
};
