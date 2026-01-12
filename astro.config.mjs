import { defineConfig } from 'astro/config';
import UnoCSS from 'unocss/astro';

// 检测部署目标
const isVercel = process.env.VERCEL === '1';
const isGitHubPages = process.env.GITHUB_PAGES === '1';

export default defineConfig({
  // 静态站点生成
  output: 'static',

  // 站点 URL（GitHub Pages 需要配置）
  site: isGitHubPages
    ? `https://${process.env.GITHUB_REPOSITORY_OWNER}.github.io`
    : process.env.SITE_URL || 'http://localhost:4321',

  // GitHub Pages 子路径（如果仓库名不是 username.github.io）
  base: isGitHubPages ? `/${process.env.GITHUB_REPOSITORY?.split('/')[1] || ''}` : '/',

  integrations: [
    UnoCSS({
      injectReset: true,
    }),
  ],

  // Vercel 适配器会自动检测，静态模式无需额外配置
  ...(isVercel && {
    output: 'static',
  }),
});
