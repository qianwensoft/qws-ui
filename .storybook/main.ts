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
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  staticDirs: ["../public"],
  async viteFinal(config) {
    return {
      ...config,
      define: {
        ...config.define,
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      },
      optimizeDeps: {
        ...config.optimizeDeps,
        include: [...(config.optimizeDeps?.include || []), 'fabric', 'react', 'react-dom'],
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
