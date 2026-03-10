// Client-only: Reads pre-built JSON, never calls Caisy API
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  publishedDate: string;
  featuredImage?: { src: string; title: string };
  author?: string;
}

export const getAllBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const response = await fetch('/data/blog-posts.json');
    if (!response.ok) throw new Error('Failed to load blog data');
    return response.json();
  } catch (error) {
    console.error('Blog load error:', error);
    return [];
  }
};

export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  const posts = await getAllBlogPosts();
  return posts.find((p) => p.slug === slug) ?? null;
};
