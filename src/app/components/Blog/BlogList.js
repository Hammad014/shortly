//cmponents/Blog/BlogList.js

import Link from 'next/link';

export default function BlogList({ posts }) {
  return (
    <div className="grid gap-8">
      {posts.map((post) => (
        <Link 
          key={post.slug} 
          href={`/blog/${post.slug}`}
          className="group block bg-slate-800/50 p-6 rounded-xl border border-slate-700 hover:border-purple-400/30 transition-all"
        >
          <article>
            <h2 className="text-2xl font-semibold text-slate-100 mb-2 group-hover:text-purple-400 transition-colors">
              {post.title}
            </h2>
            <p className="text-slate-400 mb-4">{post.excerpt}</p>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <time>{post.date}</time>
              <span>•</span>
              <span>{post.readingTime}</span>
            </div>
          </article>
        </Link>
      ))}
    </div>
  );
}