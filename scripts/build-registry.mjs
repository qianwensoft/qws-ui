#!/usr/bin/env node

/**
 * Build script to generate registry files
 * This script copies component files from src/components to registry/default
 * and generates the public/r/*.json files for shadcn CLI
 */

import { writeFileSync, cpSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

// 读取配置文件
const configPath = join(rootDir, 'registry.config.json');
let config = {
  baseUrl: '',
  homepage: 'https://github.com/yourusername/qws-ui',
  registryName: 'qws-ui'
};

if (existsSync(configPath)) {
  try {
    const configFile = readFileSync(configPath, 'utf-8');
    config = { ...config, ...JSON.parse(configFile) };
    console.log('📋 使用配置文件:', configPath);
  } catch (error) {
    console.warn('⚠️  配置文件解析失败，使用默认配置:', error.message);
  }
}

// 环境变量优先级更高
const BASE_URL = process.env.REGISTRY_BASE_URL || config.baseUrl;
const HOMEPAGE = process.env.REGISTRY_HOMEPAGE || config.homepage;
const REGISTRY_NAME = process.env.REGISTRY_NAME || config.registryName;

if (BASE_URL) {
  console.log('🌐 Base URL:', BASE_URL);
}

// Ensure directories exist
mkdirSync(join(rootDir, 'public/r'), { recursive: true });
mkdirSync(join(rootDir, 'registry/default/advanced-table'), { recursive: true });
mkdirSync(join(rootDir, 'registry/default/print-designer'), { recursive: true });
mkdirSync(join(rootDir, 'registry/default/advanced-form'), { recursive: true });

// 生成文件路径（支持绝对 URL 和相对路径）
const generateFilePath = (relativePath) => {
  if (BASE_URL) {
    return `${BASE_URL.replace(/\/$/, '')}/${relativePath}`;
  }
  return relativePath;
};

// Component definitions
const components = [
  {
    name: 'advanced-table',
    files: ['AdvancedTable.tsx', 'AdvancedTable.css'],
    config: {
      name: 'advanced-table',
      type: 'registry:component',
      title: 'Advanced Table',
      description: 'Feature-rich table component with Excel-like editing, filtering, and export capabilities.',
      registryDependencies: ['button', 'input', 'select', 'dialog', 'dropdown-menu'],
      dependencies: [
        '@tanstack/react-table@^8.10.7',
        '@dnd-kit/core@^6.1.0',
        '@dnd-kit/sortable@^7.0.2',
        '@dnd-kit/utilities@^3.2.1',
        'exceljs@^4.4.0',
        'file-saver@^2.0.5',
        'lucide-react'
      ],
      devDependencies: ['@types/file-saver@^2.0.7'],
      files: [
        {
          path: generateFilePath('registry/default/advanced-table/advanced-table.tsx'),
          type: 'registry:component',
          target: 'components/advanced-table.tsx'
        },
        {
          path: generateFilePath('registry/default/advanced-table/advanced-table.css'),
          type: 'registry:style',
          target: 'components/advanced-table.css'
        }
      ]
    }
  },
  {
    name: 'print-designer',
    files: ['PrintDesigner.tsx', 'PrintDesigner.css'],
    config: {
      name: 'print-designer',
      type: 'registry:component',
      title: 'Print Designer',
      description: 'Visual print template designer based on fabric.js.',
      registryDependencies: ['button', 'input', 'select', 'card', 'advanced-table'],
      dependencies: ['fabric@^6.9.0', 'lucide-react'],
      devDependencies: ['@types/fabric@^5.3.10'],
      files: [
        {
          path: generateFilePath('registry/default/print-designer/print-designer.tsx'),
          type: 'registry:component',
          target: 'components/print-designer.tsx'
        },
        {
          path: generateFilePath('registry/default/print-designer/print-designer.css'),
          type: 'registry:style',
          target: 'components/print-designer.css'
        }
      ]
    }
  },
  {
    name: 'advanced-form',
    files: ['AdvancedForm.tsx', 'AdvancedForm.css'],
    config: {
      name: 'advanced-form',
      type: 'registry:component',
      title: 'Advanced Form',
      description: 'Advanced form component built with TanStack Form.',
      registryDependencies: ['button', 'input', 'card'],
      dependencies: ['@tanstack/react-form@^1.26.0', 'lucide-react'],
      files: [
        {
          path: generateFilePath('registry/default/advanced-form/advanced-form.tsx'),
          type: 'registry:component',
          target: 'components/advanced-form.tsx'
        },
        {
          path: generateFilePath('registry/default/advanced-form/advanced-form.css'),
          type: 'registry:style',
          target: 'components/advanced-form.css'
        }
      ]
    }
  }
];

// Copy component files from src/components to registry/default
console.log('📦 Copying component files...');
components.forEach(({ name, files }) => {
  files.forEach(file => {
    const srcPath = join(rootDir, 'src/components', file);
    const destFileName = file.toLowerCase().replace(/([A-Z])/g, '-$1').replace(/^-/, '');
    const destPath = join(rootDir, 'registry/default', name, destFileName);

    try {
      cpSync(srcPath, destPath);
      console.log(`  ✓ ${file} → registry/default/${name}/${destFileName}`);
    } catch (error) {
      console.error(`  ✗ Failed to copy ${file}:`, error.message);
    }
  });
});

// Generate individual component JSON files
console.log('\n📝 Generating component JSON files...');
components.forEach(({ name, config }) => {
  const jsonPath = join(rootDir, 'public/r', `${name}.json`);
  writeFileSync(jsonPath, JSON.stringify(config, null, 2));
  console.log(`  ✓ ${name}.json`);
});

// Generate main registry index
console.log('\n📋 Generating registry index...');
const registry = {
  $schema: 'https://ui.shadcn.com/schema/registry.json',
  name: REGISTRY_NAME,
  homepage: HOMEPAGE,
  items: components.map(c => c.config)
};

writeFileSync(join(rootDir, 'public/r/index.json'), JSON.stringify(registry, null, 2));
writeFileSync(join(rootDir, 'registry/registry.json'), JSON.stringify(registry, null, 2));
console.log('  ✓ index.json');
console.log('  ✓ registry/registry.json');

console.log('\n✨ Registry build complete!');
if (BASE_URL) {
  console.log(`\n📍 Registry URL: ${BASE_URL}/r`);
  console.log(`📦 Install command: npx shadcn@latest add ${BASE_URL}/r/advanced-table`);
}
