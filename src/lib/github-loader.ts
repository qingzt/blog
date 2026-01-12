import type { Loader, LoaderContext } from 'astro/loaders';

// GraphQL 查询语句
const DISCUSSIONS_QUERY = `
query GetDiscussions($owner: String!, $repo: String!, $first: Int!, $after: String) {
  repository(owner: $owner, name: $repo) {
    discussions(first: $first, after: $after, orderBy: { field: CREATED_AT, direction: DESC }) {
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        number
        title
        body
        bodyHTML
        createdAt
        updatedAt
        url
        author {
          login
          avatarUrl
          url
        }
        labels(first: 10) {
          nodes {
            id
            name
            color
            description
          }
        }
        category {
          id
          name
          slug
          emoji
        }
      }
    }
  }
}
`;

// Discussion 类型定义
export interface Discussion {
  id: string;
  number: number;
  title: string;
  body: string;
  bodyHTML: string;
  createdAt: string;
  updatedAt: string;
  url: string;
  author: {
    login: string;
    avatarUrl: string;
    url: string;
  } | null;
  labels: {
    nodes: Array<{
      id: string;
      name: string;
      color: string;
      description: string | null;
    }>;
  };
  category: {
    id: string;
    name: string;
    slug: string;
    emoji: string | null;
  };
}

interface GraphQLResponse {
  data: {
    repository: {
      discussions: {
        totalCount: number;
        pageInfo: {
          hasNextPage: boolean;
          endCursor: string | null;
        };
        nodes: Discussion[];
      };
    };
  };
  errors?: Array<{ message: string }>;
}

export interface GitHubLoaderOptions {
  owner: string;
  repo: string;
  token: string;
}

/**
 * 从 GitHub GraphQL API 获取所有 Discussions
 */
async function fetchAllDiscussions(options: GitHubLoaderOptions): Promise<Discussion[]> {
  const { owner, repo, token } = options;
  const allDiscussions: Discussion[] = [];
  let hasNextPage = true;
  let cursor: string | null = null;

  while (hasNextPage) {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Astro-GitHub-Blog',
      },
      body: JSON.stringify({
        query: DISCUSSIONS_QUERY,
        variables: {
          owner,
          repo,
          first: 100, // 每次获取 100 条
          after: cursor,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const result = (await response.json()) as GraphQLResponse;

    if (result.errors) {
      throw new Error(`GraphQL errors: ${result.errors.map((e) => e.message).join(', ')}`);
    }

    const { nodes, pageInfo } = result.data.repository.discussions;
    allDiscussions.push(...nodes);

    hasNextPage = pageInfo.hasNextPage;
    cursor = pageInfo.endCursor;
  }

  return allDiscussions;
}

/**
 * 将 GitHub Label 颜色转换为 CSS 友好的颜色类
 */
export function getLabelColorClass(hexColor: string): { bg: string; text: string } {
  // 计算亮度来决定文字颜色
  const r = parseInt(hexColor.slice(0, 2), 16);
  const g = parseInt(hexColor.slice(2, 4), 16);
  const b = parseInt(hexColor.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return {
    bg: `#${hexColor}`,
    text: luminance > 0.5 ? '#1f2937' : '#ffffff',
  };
}

/**
 * 生成 URL 友好的 slug
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s\u4e00-\u9fff-]/g, '') // 保留中文字符
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * 自定义 Astro Content Loader
 * 从 GitHub Discussions 加载博客文章
 */
export function githubDiscussionsLoader(options: GitHubLoaderOptions): Loader {
  return {
    name: 'github-discussions-loader',

    async load(context: LoaderContext): Promise<void> {
      const { store, logger, generateDigest } = context;

      // 检查必要的配置
      if (!options.token || !options.owner || !options.repo) {
        logger.warn('Missing GitHub configuration. Skipping content fetch.');
        logger.warn('Please set GITHUB_TOKEN, GITHUB_OWNER, and GITHUB_REPO in .env file.');
        return;
      }

      logger.info('Fetching discussions from GitHub...');

      try {
        const discussions = await fetchAllDiscussions(options);
        logger.info(`Fetched ${discussions.length} discussions`);

        // 清空旧数据
        store.clear();

        for (const discussion of discussions) {
          // 使用 number 作为唯一 ID（更稳定）
          const id = String(discussion.number);

          // 生成摘要用于增量更新检测
          const digest = generateDigest({
            updatedAt: discussion.updatedAt,
            title: discussion.title,
          });

          // 提取标签
          const labels = discussion.labels.nodes.map((label) => ({
            name: label.name,
            color: label.color,
            description: label.description,
          }));

          // 生成摘要（取前 200 个字符）
          const excerpt = discussion.body
            .replace(/[#*`>\[\]!]/g, '') // 移除 Markdown 标记
            .replace(/\n+/g, ' ')
            .trim()
            .slice(0, 200);

          store.set({
            id,
            data: {
              number: discussion.number,
              title: discussion.title,
              slug: generateSlug(discussion.title),
              body: discussion.body,
              bodyHTML: discussion.bodyHTML,
              excerpt: excerpt + (excerpt.length >= 200 ? '...' : ''),
              createdAt: new Date(discussion.createdAt),
              updatedAt: new Date(discussion.updatedAt),
              url: discussion.url,
              author: discussion.author,
              labels,
              category: discussion.category,
            },
            digest,
          });
        }

        logger.info(`Loaded ${discussions.length} posts into collection`);
      } catch (error) {
        logger.error(`Failed to fetch discussions: ${error}`);
        throw error;
      }
    },
  };
}

export default githubDiscussionsLoader;
