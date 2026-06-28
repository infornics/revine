export type RenderMode = "csr" | "ssg" | "ssr";

export interface RevinePageConfig {
  /** Rendering mode for this page. Default: "csr" */
  mode?: RenderMode;
  /** ISR revalidation interval in seconds. Only applies when mode is "ssg". */
  revalidate?: number;
}

export interface PageMetadata {
  /** File path relative to project root (e.g., "/src/pages/blog/[slug].tsx") */
  filePath: string;
  /** Resolved React Router path (e.g., "/blog/:slug") */
  routePath: string;
  /** Rendering mode */
  mode: RenderMode;
  /** ISR revalidation in seconds */
  revalidate?: number;
  /** Static paths generator for dynamic SSG routes */
  getStaticPaths?: () => Promise<string[]> | string[];
}
