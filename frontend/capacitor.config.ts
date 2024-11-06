import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.nextchapterai.app',
  appName: 'NextChapterAI',
  webDir: 'dist',
  plugins: {
    CapacitorCookies: {
      enabled: true,
    },
  },
};

export default config;
