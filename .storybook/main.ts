import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-onboarding",
    "@chromatic-com/storybook",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {
      reactOptions: {
        strictMode: true,
      },
      fastRefresh: true,
    },
  },
  docs: {
    autodocs: "tag",
  },
  staticDirs: ["../public"],
  async viteFinal(config, { configType }) {
    const isProduction = configType === 'PRODUCTION';
    
    // Don't override mode - let Vite handle it naturally
    return {
      ...config,
      define: {
        ...config.define,
        // Only set NODE_ENV if it's actually needed
        ...(isProduction ? { 'process.env.NODE_ENV': '"production"' } : {}),
      },
      optimizeDeps: {
        ...config.optimizeDeps,
        include: [...(config.optimizeDeps?.include || []), 'fabric'],
      },
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
        },
      },
    };
  },
};

export default config;
