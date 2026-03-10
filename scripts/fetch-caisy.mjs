import { writeFile, mkdir } from 'node:fs/promises';

const PROJECT_ID = process.env.CAISY_PROJECT_ID || '7763a144-9074-4dc5-a2f5-e2521e343d6b';
const API_KEY = process.env.CAISY_API_KEY || 'f2iiXhHIObO05aNEle1vDlaDq0iGHmbr';
const ENDPOINT = `https://cloud.caisy.io/api/v3/e/${PROJECT_ID}/graphql`;

// ── Rich Text Renderer ────────────────────────────────────────────────────────
const renderMarks = (text, marks = []) => {
  let out = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  for (const mark of marks) {
    switch (mark.type) {
      case 'bold':      out = `<strong>${out}</strong>`; break;
      case 'italic':    out = `<em>${out}</em>`; break;
      case 'underline': out = `<u>${out}</u>`; break;
      case 'strike':    out = `<s>${out}</s>`; break;
      case 'code':      out = `<code>${out}</code>`; break;
      case 'link':      out = `<a href="${mark.attrs?.href ?? '#'}" target="_blank" rel="noopener">${out}</a>`; break;
    }
  }
  return out;
};

const renderInline = (nodes = []) => nodes.map(n => {
  if (n.type === 'text')      return renderMarks(n.text ?? '', n.marks);
  if (n.type === 'hardBreak') return '<br />';
  if (n.type === 'image')     return `<img src="${n.attrs?.src ?? ''}" alt="${n.attrs?.alt ?? ''}" />`;
  if (n.content)              return renderInline(n.content);
  return '';
}).join('');

const renderNode = (node) => {
  const inner    = () => renderInline(node.content ?? []);
  const children = () => (node.content ?? []).map(renderNode).join('');

  switch (node.type) {
    case 'paragraph':      return `<p>${inner()}</p>`;
    case 'heading':        return `<h${node.attrs?.level ?? 2}>${inner()}</h${node.attrs?.level ?? 2}>`;
    case 'bulletList':     return `<ul>${children()}</ul>`;
    case 'orderedList':    return `<ol>${children()}</ol>`;
    case 'listItem':       return `<li>${children()}</li>`;
    case 'blockquote':     return `<blockquote>${children()}</blockquote>`;
    case 'codeBlock':      return `<pre><code>${inner()}</code></pre>`;
    case 'horizontalRule': return `<hr />`;
    case 'hardBreak':      return `<br />`;
    case 'image':          return `<img src="${node.attrs?.src ?? ''}" alt="${node.attrs?.alt ?? ''}" />`;
    case 'table':          return `<table>${children()}</table>`;
    case 'tableRow':       return `<tr>${children()}</tr>`;
    case 'tableCell':      return `<td>${children()}</td>`;
    case 'tableHeader':    return `<th>${children()}</th>`;
    default:               return children();
  }
};

const convertToHTML = (content) => {
  if (!content?.json?.content?.length) return '';
  try { return content.json.content.map(renderNode).join(''); }
  catch (e) { console.error('Render error:', e); return ''; }
};

const extractExcerpt = (content, max = 200) => {
  const text = convertToHTML(content).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  return text.length > max ? text.slice(0, max).trimEnd() + '…' : text;
};

// ── Fetch + Save ──────────────────────────────────────────────────────────────
async function main() {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-caisy-apikey': API_KEY },
    body: JSON.stringify({
      query: `query { allBlog { edges { node {
        id title slug author publishedDate
        featuredImage { src title }
        content { json }
      } } } }`
    }),
  });

  if (!res.ok) throw new Error(`Caisy HTTP ${res.status}`);
  const { data, errors } = await res.json();
  if (errors) throw new Error(`GraphQL: ${JSON.stringify(errors)}`);

  const posts = data.allBlog.edges.map(({ node }) => ({
    id:            node.id,
    title:         node.title,
    slug:          node.slug,
    author:        node.author,
    publishedDate: node.publishedDate,
    featuredImage: node.featuredImage ?? undefined,
    content:       convertToHTML(node.content),
    excerpt:       extractExcerpt(node.content),
  }));

  // Create folder if missing
  await mkdir('./public/data', { recursive: true });
  await writeFile('./public/data/blog-posts.json', JSON.stringify(posts, null, 2));
  console.log(`✅ Saved ${posts.length} blog posts → public/data/blog-posts.json`);
}

main().catch((e) => { console.error('❌ Fetch failed:', e.message); process.exit(1); });
