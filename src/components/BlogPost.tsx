import Link from 'next/link';
import { getTranslation } from '../contexts/LanguageContext';
import { Language } from '../translations';

interface BlogPostProps {
    slug: string;
    title: string;
    date: string;
    category: string;
    summary: string;
    lang: Language;
    tags: string[]; // 添加 tags 属性
}

export default function BlogPost({ slug, title, date, category, summary, lang, tags }: BlogPostProps) {
    return (
        <article className="post">
            <h2 className="text-2xl font-bold mb-2">{title}</h2>
            <p className="post-meta">
                {getTranslation(lang, 'publishedOn')} {date} | {getTranslation(lang, 'category')}: {category}
            </p>
            <p className="mb-4">{summary}</p>
            <div className="mb-4">
                {tags.map((tag) => (
                    <Link key={tag} href={`/${lang}/tag/${encodeURIComponent(tag)}`} className="mr-2">
                        <span className="italic">#{tag}</span>
                    </Link>
                ))}
            </div>
            <Link href={`/${lang}/posts/${slug}`} className="read-more">
                {getTranslation(lang, 'readMore')}
            </Link>
        </article>
    );
}