//components/Blog/BlogLayout.js

import Head from 'next/head';
import Link from 'next/link';

export default function BlogLayout({ children, meta }) {
  return (
    <>
      <Head>
        <title>{meta.title} | Linkly Blog</title>
        <meta name="description" content={meta.excerpt} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.excerpt} />
        <meta property="og:image" content={meta.coverImage} />
      </Head>

      <div className="min-h-screen bg-slate-900">
        <main className="max-w-3xl mx-auto px-4 py-12">
          <div className="mb-8">
            <Link 
              href="/blog" 
              className="text-slate-400 hover:text-purple-400 flex items-center gap-2"
            >
              ← Back to Blog
            </Link>
          </div>

          <article className="prose prose-invert max-w-none">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              {meta.title}
            </h1>
            
            <div className="flex items-center gap-4 mt-4 text-slate-400">
              <time>{new Date(meta.date).toLocaleDateString()}</time>
              <span>•</span>
              <span>{meta.readingTime}</span>
            </div>

            {meta.coverImage && (
              <img 
                src={meta.coverImage} 
                alt={meta.title} 
                className="rounded-xl mt-8 w-full object-cover"
              />
            )}

            <div className="mt-8">
              {children}
            </div>
          </article>
        </main>
      </div>
    </>
  );
}