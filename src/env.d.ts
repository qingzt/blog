/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly GITHUB_TOKEN: string;
  readonly GITHUB_OWNER: string;
  readonly GITHUB_REPO: string;
  readonly GISCUS_REPO: string;
  readonly GISCUS_REPO_ID: string;
  readonly GISCUS_CATEGORY: string;
  readonly GISCUS_CATEGORY_ID: string;
  readonly SITE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
