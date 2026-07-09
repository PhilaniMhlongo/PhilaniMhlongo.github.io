export interface BlogPost {
  id: string;
  title: string;
  subtitle: string;
  fileName: string;
  description: string;
  publishedDate: string;
  updatedDate?: string;
  readingTime: string;
  tags: string[];
  featured: boolean;
  series?: string;
  seriesOrder?: number;
  author: string;
}

export interface BlogTag {
  name: string;
  color: string;
  count: number;
}

export interface BlogSeries {
  name: string;
  description: string;
  postIds: string[];
}

export interface BlogMetadata {
  posts: BlogPost[];
  tags: BlogTag[];
  series?: BlogSeries[];
}
