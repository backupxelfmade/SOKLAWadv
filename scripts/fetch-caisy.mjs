import { writeFile } from 'node:fs/promises';

const PROJECT_ID = process.env.CAISY_PROJECT_ID || '7763a144-9074-4dc5-a2f5-e2521e343d6b';
const API_KEY = process.env.CAISY_API_KEY || 'f2iiXhHIObO05aNEle1vDlaDq0iGHmbr';
const ENDPOINT = `https://cloud.caisy.io/api/v3/e/${PROJECT_ID}/graphql`;

async function main() {
  const controller = new AbortController();
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-caisy-apikey': API_KEY },
    body: JSON.stringify({
      query: `query { allBlog { edges { node { id title slug author publishedDate featuredImage { src title } content { json } } } }`
    }),
    signal: controller.signal
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const { data } = await res.json();
  
  const posts = data.allBlog.edges.map(({ node }) => ({
    id: node.id, title: node.title, slug: node.slug, author: node.author,
    publishedDate: node.publishedDate, featuredImage: node.featuredImage,
    content: '<p>Static content loaded!</p>', // Simplified
    excerpt: node.title.slice(0, 100) + '...'
  }));

  await writeFile('./public/data/blog-posts.json', JSON.stringify(posts, null, 2));
  console.log(`✅ ${posts.length} posts`);
}

main().catch(console.error);
