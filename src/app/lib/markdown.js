//lib/markdown.js

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkHtml from 'remark-html';
import readingTime from 'reading-time';

// Path to content directory inside app folder
const contentPath = path.join(process.cwd(), 'src', 'app', 'content');
console.log("Content path:", contentPath);


export async function getPostBySlug(type, slug) {
  try {
    const filePath = path.join(contentPath, type, `${slug}.md`);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    const processedContent = await unified()
      .use(remarkParse)
      .use(remarkHtml)
      .process(content);

    const contentHtml = processedContent.toString();
    const stats = readingTime(content);

    return {
      slug,
      frontMatter: {
        ...data,
        readingTime: stats.text,
        date: data.date.toISOString(),
      },
      content: contentHtml,
    };
  } catch (error) {
    return null;
  }
}

export async function getAllPosts(type) {
  const dirPath = path.join(contentPath, type);
  
  if (!fs.existsSync(dirPath)) {
    throw new Error(`Content directory not found: ${dirPath}`);
  }

  const files = fs.readdirSync(dirPath, { 
    withFileTypes: true 
  }).filter(dirent => dirent.isFile())
   .map(dirent => dirent.name);

  return Promise.all(files.map(async (filename) => {
    const filePath = path.join(dirPath, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);
    const stats = readingTime(fileContents);

    return {
      slug: filename.replace(/\.md$/, ''),
      ...data,
      readingTime: stats.text,
      date: new Date(data.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };
  }));
}