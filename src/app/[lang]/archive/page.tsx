import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import ArchiveList from '../../../components/ArchiveList';
import { getAllPosts } from '../../../utils/mdUtils';
import { getTranslation } from '../../../contexts/LanguageContext';
import { Language, languages } from '../../../translations';


interface ArchiveProps {
    params: { lang: string };
}

export async function generateStaticParams() {
    return languages.map(lang => ({
        lang,
    }));
}


export default async function Archive({ params }: ArchiveProps) {
    const { lang } = params as { lang: 'en' | 'zh' };
    const posts = await getAllPosts(lang);

    const formattedPosts = posts.map(post => ({
        ...post,
        title: post.content.split('\n')[0] || 'Untitled',
        date: new Date().toISOString(),
        category: 'Uncategorized',
        summary: post.content.slice(0, 100) + '...'
    }));

    return (
        <div className="container">
            <main>
                <h1 className="text-3xl font-bold mb-4">{getTranslation(lang, 'archive')}</h1>
                <ArchiveList posts={formattedPosts} lang={lang} />
            </main>
        </div>
    );
}