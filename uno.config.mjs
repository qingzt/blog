import { defineConfig, presetUno, presetAttributify, presetTypography, presetIcons } from 'unocss';

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetTypography({
      cssExtend: {
        'a': {
          'color': 'var(--un-prose-links)',
          'text-decoration': 'underline',
          'text-underline-offset': '2px',
        },
        'code::before': { content: '""' },
        'code::after': { content: '""' },
        'code': {
          'background-color': '#f3f4f6',
          'padding': '0.125rem 0.25rem',
          'border-radius': '0.25rem',
          'font-size': '0.875em',
        },
      },
    }),
    presetIcons({
      scale: 1.2,
      cdn: 'https://esm.sh/',
    }),
  ],
  shortcuts: {
    'btn': 'px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors',
    'card': 'p-6 rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow',
    'tag': 'px-2 py-1 text-xs rounded-full',
  },
  theme: {
    colors: {
      primary: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
      },
    },
  },
  safelist: [
    // 为动态生成的标签颜色预留
    ...['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'gray'].map(
      (c) => [`bg-${c}-100`, `text-${c}-700`, `bg-${c}-500`]
    ).flat(),
  ],
});
