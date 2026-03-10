// Node script: Runs ONLY during build, uses server env vars
import { readFile, writeFile } from 'node:fs/promises';
import { $fetch } from 'ohmyfetch'; // npm i -D ohmyfetch @types/node

const PROJECT_ID = process.env.CAISY_PROJECT_ID;
const API_KEY = process.env.CAISY_API_KEY;

if (!PROJECT_ID || !API_KEY) {
  throw new Error('Missing CAISY_PROJECT_ID or CAISY_API_KEY env vars');
}

const ENDPOINT = `https://cloud.caisy.io/api/v3/e/${PROJECT_ID}/graphql`;

const fetchFromCaisy = async (query) => {
  const res = await $fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-caisy-apikey': API_KEY,
    },
    body: JSON.stringify({ query }),
  });
  if (res.errors) throw new Error(`GraphQL: ${JSON.stringify(res.errors)}`);
  return res;
};

const renderNode = (node) => {
  // Simplified version of your renderer (full logic here)
  switch (node.type) {
    case 'paragraph': return `<p>${node.content?.map(renderNode).join('') || ''}</p>`;
    case 'heading': return `<h${node.attrs?.level || 2}>${node.content?.map(renderNode).join('') || ''}</h${node.attrs?.level || 2}>`;
    case 'text': return node.text || '';
    // Add other cases as needed...
    default: return node.content ? node.content.map(renderNode).join('') : '';
  }
};

const convertContent = (content) => {
  if (!content?.json?.content) return '';
  return content.json.content.map(renderNode).join('');
};

async function main() {
  const query = `query { allBlog { edges { node { id title slug author publishedDate featuredImage { src title } content { json } } } } }`;
  const { data } = await fetchFromCaisy(query);

  const posts = data.allBlog.edges.map(({ node }) => ({
    id: node.id,
    title: node.title,
    slug: node.slug,
    author: node.author,
    publishedDate: node.publishedDate,
    featuredImage: node.featuredImage,
    content: convertContent(node.content),
    excerpt: node.content ? (convertContent(node.content).replace(/<[^>]*>/g, '').slice(0, 200) + '...') : '',
  }));

  await writeFile(new URL('../public/data/blog-posts.json', import.meta.url), JSON.stringify(posts, null, 2));
  console.log(`✅ Fetched & saved ${posts.length} blog posts`);
}

main().catch(console.error);
