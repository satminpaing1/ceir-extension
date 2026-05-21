import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'wxt';
import obfuscator from 'vite-plugin-javascript-obfuscator';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  vite: () => ({
    plugins: [
      tailwindcss(),
      obfuscator({
        include: ['**/*.js', '**/*.ts', '**/*.jsx', '**/*.tsx'],
        exclude: [/node_modules/],
        apply: 'build', // GitHub ကနေ Zip ထုတ်တဲ့အချိန်မှသာ အလုပ်လုပ်စေရန်
        options: {
          compact: true,
          controlFlowFlattening: true,
          controlFlowFlatteningThreshold: 0.5,
          identifierNamesGenerator: 'hexadecimal', 
          stringArray: true,
          stringArrayEncoding: ['base64'], 
          splitStrings: true,
          simplify: true
        }
      })
    ]
  }),
  manifest: {
    host_permissions: ['https://ceir.gov.mm/check-status'],
    permissions: ['storage'], 
  },
});
