const CAISY_API_KEY = 'f2iiXhHIObO05aNEle1vDlaDq0iGHmbr';
const CAISY_PROJECT_ID = '7763a144-9074-4dc5-a2f5-e2521e343d6b';
const CAISY_GRAPHQL_ENDPOINT = `https://cloud.caisy.io/api/v3/e/${CAISY_PROJECT_ID}/graphql`;

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

interface CaisyBlogPost {
  id: string;
  title: string;
  slug: string;
  author?: string;
  publishedDate: string;
  featuredImage?: { src: string; title: string };
  content?: { json: any };
}

interface CaisyResponse {
  data: {
    allBlog: {
      edges: Array<{ node: CaisyBlogPost }>;
    };
  };
}

// ── Fetch ─────────────────────────────────────────────────────────────────────
const fetchFromCaisy = async (query: string): Promise<CaisyResponse> => {
  const response = await fetch(CAISY_GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-caisy-apikey': CAISY_API_KEY,
    },
    cache: 'no-store', // always fetch fresh content
    body: JSON.stringify({ query }),
  });

  if (!response.ok) throw new Error(`API request failed: ${response.status}`);

  const result = await response.json();
  if (result.errors) throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);

  return result;
};

// ── Rich Text → HTML ──────────────────────────────────────────────────────────
const renderMarks = (text: string, marks: any[] = []): string => {
  let out = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  for (const mark of marks) {
    switch (mark.type) {
      case 'bold':      out = `<strong>${out}</strong>`; break;
      case 'italic':    out = `<em>${out}</em>`; break;
      case 'underline': out = `<u>${out}</u>`; break;
      case 'strike':    out = `<s>${out}</s>`; break;
      case 'code':      out = `<code>${out}</code>`; break;
      case 'link':
        out = `<a href="${mark.attrs?.href ?? '#'}" target="${mark.attrs?.target ?? '_blank'}" rel="noopener noreferrer">${out}</a>`;
        break;
    }
  }
  return out;
};

const renderInline = (nodes: any[] = []): string =>
  nodes.map((node) => {
    if (node.type === 'text') return renderMarks(node.text ?? '', node.marks);
    if (node.type === 'hardBreak') return '<br />';
    if (node.type === 'image')
      return `<img src="${node.attrs?.src ?? ''}" alt="${node.attrs?.alt ?? ''}" title="${node.attrs?.title ?? ''}" />`;
    // Nested inline
    if (node.content) return renderInline(node.content);
    return '';
  }).join('');

const renderNode = (node: any): string => {
  const inner = () => renderInline(node.content ?? []);
  const children = () => (node.content ?? []).map(renderNode).join('');

  switch (node.type) {
    case 'paragraph':
      return `<p>${inner()}</p>`;

    case 'heading': {
      const level = node.attrs?.level ?? 2;
      return `<h${level}>${inner()}</h${level}>`;
    }

    case 'bulletList':
      return `<ul>${children()}</ul>`;

    case 'orderedList':
      return `<ol>${children()}</ol>`;

    case 'listItem':
      return `<li>${children()}</li>`;

    case 'blockquote':
      return `<blockquote>${children()}</blockquote>`;

    case 'codeBlock':
      return `<pre><code>${inner()}</code></pre>`;

    case 'horizontalRule':
      return `<hr />`;

    case 'hardBreak':
      return `<br />`;

    case 'image':
      return `<img src="${node.attrs?.src ?? ''}" alt="${node.attrs?.alt ?? ''}" title="${node.attrs?.title ?? ''}" />`;

    case 'table':
      return `<table>${children()}</table>`;
    case 'tableRow':
      return `<tr>${children()}</tr>`;
    case 'tableCell':
      return `<td>${children()}</td>`;
    case 'tableHeader':
      return `<th>${children()}</th>`;

    default:
      // Fallback — render children if any so nothing is silently dropped
      return node.content ? children() : '';
  }
};

const convertCaisyContentToHTML = (content: any): string => {
  if (!content?.json?.content || !Array.isArray(content.json.content)) return '';
  try {
    return content.json.content.map(renderNode).join('');
  } catch (e) {
    console.error('Failed to convert Caisy content:', e);
    return '';
  }
};

const extractExcerpt = (content: any, maxLength = 200): string => {
  const html = convertCaisyContentToHTML(content);
  const text = html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  return text.length > maxLength ? text.substring(0, maxLength).trimEnd() + '…' : text;
};

// ── Queries ───────────────────────────────────────────────────────────────────
const BLOG_FIELDS = `
  id
  title
  slug
  author
  publishedDate
  featuredImage { src title }
  content { json }
`;

export const getAllBlogPosts = async (): Promise<BlogPost[]> => {
  const query = `query AllBlogPosts { allBlog { edges { node { ${BLOG_FIELDS} } } } }`;
  const response = await fetchFromCaisy(query);

  return response.data.allBlog.edges.map(({ node }) => ({
    id: node.id,
    title: node.title,
    slug: node.slug,
    author: node.author,
    publishedDate: node.publishedDate,
    featuredImage: node.featuredImage,
    content: convertCaisyContentToHTML(node.content),
    excerpt: extractExcerpt(node.content),
  }));
};

export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  const posts = await getAllBlogPosts();
  return posts.find((p) => p.slug === slug) ?? null;
};
