import Link from 'next/link';
import { getTranslation } from '../contexts/LanguageContext';
import { Language } from '../translations';

interface Post {
    slug: string;
    title: string;
    date: string;
    category: string;
    summary: string;
}

interface ArchiveListProps {
    posts: Post[];
    lang: Language;
}

export default function ArchiveList({ posts, lang }: ArchiveListProps) {
    // Filter out posts without title or date
    const validPosts = posts.filter(post => post.title && post.date);

    // Group posts by year
    const postsByYear = validPosts.reduce((acc, post) => {
        const date = new Date(post.date);
        const year = isNaN(date.getFullYear()) ? getTranslation(lang, 'other') : date.getFullYear().toString();
        if (!acc[year]) {
            acc[year] = [];
        }
        acc[year].push(post);
        return acc;
    }, {} as Record<string, Post[]>);

    // Sort years in descending order
    const sortedYears = Object.keys(postsByYear).sort((a, b) => {
        if (a === getTranslation(lang, 'other')) return 1;
        if (b === getTranslation(lang, 'other')) return -1;
        return parseInt(b) - parseInt(a);
    });

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedYears.map((year) => (
                postsByYear[year].length > 0 && (
                    <div key={year} className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">{year}</h2>
                        <ul className="space-y-2">
                            {postsByYear[year].map((post) => (
                                <li key={post.slug} className="border-b pb-2">
                                    <Link href={`/${lang}/posts/${post.slug}`} className="text-lg font-semibold hover:text-green-600 dark:hover:text-green-400">
                                        {post.title}
                                    </Link>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {isNaN(new Date(post.date).getTime())
                                            ? getTranslation(lang, 'noDate')
                                            : new Date(post.date).toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', { month: 'short', day: 'numeric' })
                                        } | {getTranslation(lang, 'category')}: {post.category || getTranslation(lang, 'uncategorized')}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                )
            ))}
        </div>
    );
}