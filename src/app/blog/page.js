//blog/page.js

// Add this import at the top
import { getAllPosts, getPostBySlug } from '../lib/markdown';

export default async function BlogPage() {
  const posts = await getAllPosts('blog');

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-slate-100">
          Linkly Blog
        </h1>
        <div className="grid gap-8">
          {posts.map((post) => (
            <article 
              key={post.slug}
              className="bg-slate-800/50 p-6 rounded-xl border border-slate-700"
            >
              <h2 className="text-2xl font-semibold text-slate-100 mb-2">
                <a href={`/blog/${post.slug}`} className="hover:text-purple-400">
                  {post.title}
                </a>
              </h2>
              <p className="text-slate-400 mb-4">{post.excerpt}</p>
              <div className="flex items-center text-sm text-slate-500">
                <time>{post.date}</time>
                <span className="mx-2">•</span>
                <span>{post.readingTime}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}