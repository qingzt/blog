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
    'card': 'p-5 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow border border-gray-100',
    'tag': 'px-2 py-1 text-xs rounded',
    'nav-link': 'px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded transition-all',
  },
  theme: {
    colors: {
      primary: {
        50: '#fef8f5',
        100: '#fef2ed',
        200: '#fce4db',
        300: '#fad6c9',
        400: '#f8c8b7',
        500: '#f6baa5',
        600: '#e89b7e',
        700: '#d97c58',
        800: '#cb5d32',
        900: '#bd3e0c',
      },
      cream: {
        50: '#fefdfb',
        100: '#fdfbf7',
        200: '#fbf7ef',
        300: '#f9f3e7',
        400: '#f7efdf',
        500: '#f5ebd7',
        600: '#dccfbc',
        700: '#c3b3a1',
        800: '#aa9786',
        900: '#917b6b',
      },
    },
    breakpoints: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
  },
  safelist: [
    // 为动态生成的标签颜色预留
    ...['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'gray'].map(
      (c) => [`bg-${c}-100`, `text-${c}-700`, `bg-${c}-500`]
    ).flat(),
  ],
});
