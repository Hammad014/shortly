//components/Blog/BlogPost.js

import Head from 'next/head';

export default function BlogPost({ post }) {
  return (
    <>
      <Head>
        <title>{post.frontMatter.title} | Linkly Blog</title>
        <meta name="description" content={post.frontMatter.excerpt} />
        <meta property="og:title" content={post.frontMatter.title} />
        <meta property="og:description" content={post.frontMatter.excerpt} />
        <meta property="og:image" content={post.frontMatter.coverImage} />
      </Head>
      
      <article className="max-w-3xl mx-auto px-4 py-12">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-slate-100 mb-4">
            {post.frontMatter.title}
          </h1>
          <div className="flex items-center text-slate-400 space-x-4">
            <time>{new Date(post.frontMatter.date).toLocaleDateString()}</time>
            <span>•</span>
            <span>{post.frontMatter.readingTime}</span>
          </div>
        </header>
        
        <div 
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </>
  );
}