//blog/[slug]/page.js

import { getPostBySlug, getAllPosts } from '@/app/lib/markdown';
import { notFound } from 'next/navigation';
import BlogLayout from '@/app/components/Blog/BlogLayout';

export async function generateStaticParams() {
  const posts = await getAllPosts('blog');
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPost({ params }) {
  const post = await getPostBySlug('blog', params.slug);

  if (!post) {
    notFound();
  }

  return (
    <BlogLayout meta={post.frontMatter}>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </BlogLayout>
  );
}