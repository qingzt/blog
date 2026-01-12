import { defineCollection, z } from 'astro:content';
import { githubDiscussionsLoader } from './lib/github-loader';

// 从环境变量获取配置
const GITHUB_TOKEN = import.meta.env.GITHUB_TOKEN;
const GITHUB_OWNER = import.meta.env.GITHUB_OWNER;
const GITHUB_REPO = import.meta.env.GITHUB_REPO;

// 验证必要的环境变量
if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
  console.warn(
    '⚠️  Missing required environment variables: GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO\n' +
    '   Copy .env.example to .env and fill in the values.'
  );
}

// 定义博客文章集合
const posts = defineCollection({
  loader: githubDiscussionsLoader({
    owner: GITHUB_OWNER || '',
    repo: GITHUB_REPO || '',
    token: GITHUB_TOKEN || '',
  }),
  schema: z.object({
    number: z.number(),
    title: z.string(),
    slug: z.string(),
    body: z.string(),
    bodyHTML: z.string(),
    excerpt: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    url: z.string().url(),
    author: z.object({
      login: z.string(),
      avatarUrl: z.string().url(),
      url: z.string().url(),
    }).nullable(),
    labels: z.array(z.object({
      name: z.string(),
      color: z.string(),
      description: z.string().nullable(),
    })),
    category: z.object({
      id: z.string(),
      name: z.string(),
      slug: z.string(),
      emoji: z.string().nullable(),
    }),
  }),
});

export const collections = { posts };
