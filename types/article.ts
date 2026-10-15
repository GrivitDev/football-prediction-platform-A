// frontend/types/article.ts

export type ArticleStatus =
  | 'draft'
  | 'published';

export interface ArticleSeo {
  title: string | null;
  description: string | null;
  focusKeyword: string | null;
  canonicalUrl: string | null;
}

export interface Article {
  _id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  excerpt: string | null;
  slug: string;
  content: string;
  authorId: string;
  featuredImageUrl: string | null;
  featuredImageAlt: string | null;
  featuredImagePublicId: string | null;
  seo: ArticleSeo;
  tags: string[];
  status: ArticleStatus;
  publishedAt: string | null;
  likesCount: number;
  viewsCount: number;
  wordCount: number;
  readingTimeMinutes: number;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleListResponse {
  data: Article[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateArticleData {
  title: string;
  subtitle?: string;
  description?: string;
  slug?: string;
  excerpt?: string;
  content: string;
  featuredImageUrl?: string;
  featuredImageAlt?: string;
  featuredImagePublicId?: string;
  seoTitle?: string;
  seoDescription?: string;
  focusKeyword?: string;
  canonicalUrl?: string;
  tags?: string[];
  publishedAt?: string;
}

export type UpdateArticleData =
  Partial<CreateArticleData>;

export interface ArticleQueryParams {
  search?: string;
  status?: ArticleStatus;
  tag?: string;
  page?: number;
  limit?: number;
}

export interface ArticleSeoCheck {
  key: string;
  passed: boolean;
  label: string;
  message: string;
  recommendation?: string;
}

export interface ArticleSeoAnalysis {
  score: number;
  checks: ArticleSeoCheck[];
  metrics: {
    wordCount: number;
    headingCount: number;
    h1Count: number;
    paragraphCount: number;
    linkCount: number;
    internalLinkCount: number;
    externalLinkCount: number;
    imageCount: number;
    imagesWithoutAlt: number;
    focusKeywordCount: number;
  };
}

export interface CheckGrammarResponse {
  matches: GrammarMatch[];
  language: string;
  totalIssues: number;
}

export interface GrammarMatch {
  message: string;
  shortMessage: string;
  offset: number;
  length: number;
  replacements: {
    value: string;
  }[];
  context: {
    text: string;
    offset: number;
    length: number;
  };
  sentence: string;
  rule: {
    id: string;
    description: string;
    category?: {
      id: string;
      name: string;
    };
  };
}

export type AiWritingAction =
  | 'generate'
  | 'improve'
  | 'rewrite'
  | 'humanize'
  | 'shorten'
  | 'expand'
  | 'seo'
  | 'headings';

export type AiWritingTarget =
  | 'whole-article'
  | 'title'
  | 'subtitle'
  | 'description';

export interface AiWritingData {
  content: string;

  title?: string;

  subtitle?: string;

  description?: string;

  excerpt?: string;

  focusKeyword?: string;

  slug?: string;

  seoTitle?: string;

  seoDescription?: string;

  canonicalUrl?: string;

  tags?: string[];

  action: AiWritingAction;

  target: AiWritingTarget;
}

export interface AiGeneratedArticle {
  title: string;

  subtitle: string;

  description: string;

  excerpt: string;

  slug: string;

  seoTitle: string;

  seoDescription: string;

  focusKeyword: string;

  canonicalUrl: string;

  tags: string[];

  contentHtml: string;
}

export interface AiSeoSuggestion {
  seoTitle: string;

  seoDescription: string;

  suggestedSlug: string;

  focusKeyword: string;

  revisedContentHtml: string;

  changes: string[];

  unresolvedIssues: string[];
}

export interface AiHeadingItem {
  level: 1 | 2 | 3;

  text: string;
}

export interface AiHeadingsSuggestion {
  headings: AiHeadingItem[];

  revisedContentHtml: string;
}

export interface AiWritingResponse {
  result: string;

  model: string;

  generated?: AiGeneratedArticle;

  seo?: AiSeoSuggestion;

  headings?: AiHeadingsSuggestion;
}