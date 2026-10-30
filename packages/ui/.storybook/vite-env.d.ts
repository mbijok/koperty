/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Set per Vitest project in the root vite.config.ts to run story tests in each theme.
  readonly VITE_STORYBOOK_THEME?: string;
}
