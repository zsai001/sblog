import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import yaml from 'js-yaml'

const contentDirectory = path.join(process.cwd(), 'content');

export async function getContactContent(lang: string) {
    // Implementation of getContactContent
    const fullPath = path.join(contentDirectory, lang, 'contact.md');
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents, {
        engines: {
          yaml: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA }) as object
        }
      })

    return {
        title: data.title,
        content: content
    };
}
export function getAllPosts(lang: string) {
    const postsDirectory = path.join(contentDirectory, lang, 'posts');
    const fileNames = fs.readdirSync(postsDirectory);
    const posts = [];

    for (const fileName of fileNames) {
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents, {
            engines: {
              yaml: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA }) as object
            }
          })
        posts.push({ 
            slug: fileName.replace(/\.md$/, ''),
            ...data,    
            content: content.slice(0, 200) + '...' // Just include a preview of the content
        });
    }
    return posts;
}

export function getAboutContent(lang: string) {
    try {
        const fullPath = path.join(contentDirectory, lang, 'about.md');
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents, {
            engines: {
              yaml: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA }) as object
            }
          })

        return {
            title: data.title,
            content: content
        };
    } catch (error) {
        console.error(`Error reading about content for language ${lang}:`, error);
        return {
            title: 'About',
            content: 'Content not available.'
        };
    }
}

export function getAllPostSlugs(lang: string) {
    const postsDirectory = path.join(contentDirectory, lang, 'posts');
    const fileNames = fs.readdirSync(postsDirectory);
    return fileNames.map(fileName => fileName.replace(/\.md$/, ''));
}

export function getPostData(slug: string, lang: string) {
    const fullPath = path.join(contentDirectory, lang, 'posts', `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents, {
        engines: {
          yaml: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA }) as object
        }
      })

    return {
        slug,
        ...(data as { 
            title: string; 
            date: string; 
            category: string; 
            summary: string; 
            tags?: string[]; 
        }),
        content,
        tags: data.tags || [],
    };
}

export function getAllTags(lang: string) {
    const postsDirectory = path.join(contentDirectory, lang, 'posts');
    const fileNames = fs.readdirSync(postsDirectory);
    const allTags = new Set<string>();

    for (const fileName of fileNames) {
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(fileContents);

        if (data.tags && Array.isArray(data.tags)) {
            data.tags.forEach((tag: string) => allTags.add(tag));
        }
    }

    return Array.from(allTags);
}

interface PostData {
    title: string;
    date: string;
    category: string;
    summary: string;
    tags?: string[];
    telegramPostId?: string;
}

export function getPostsByTag(tag: string, lang: string) {
    const postsDirectory = path.join(contentDirectory, lang, 'posts');
    const fileNames = fs.readdirSync(postsDirectory);
    const posts: (PostData & { slug: string; content: string })[] = [];

    for (const fileName of fileNames) {
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents, {
            engines: {
              yaml: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA }) as object
            }
          })

        if (data.tags && Array.isArray(data.tags) && data.tags.some((t: string) => t.toLowerCase() === tag.toLowerCase())) {
            posts.push({
                slug: fileName.replace(/\.md$/, ''),
                ...(data as PostData),
                content: content.slice(0, 200) + '...' // Just include a preview of the content
            });
        }
    }

    return posts;
}

export async function generateStaticParams() {
    const languages = ['en', 'zh'];
    const params = [];

    for (const lang of languages) {
        const slugs = await getAllPostSlugs(lang);

        // Home page
        params.push({ lang });

        // Individual post pages
        for (const slug of slugs) {
            params.push({ lang, slug });
        }

        // About page
        params.push({ lang, page: 'about' });

        // Contact page
        params.push({ lang, page: 'contact' });

        // Archive page
        params.push({ lang, page: 'archive' });

        // Tag pages
        const tags = await getAllTags(lang);
        for (const tag of tags) {
            params.push({ lang, tag });
        }
    }

    return params;
}