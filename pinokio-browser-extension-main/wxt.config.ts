import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    host_permissions: ['http://10.10.0.3/*', 'http://10.10.0.4/*'],
    permissions: ['storage'],
  },
});
