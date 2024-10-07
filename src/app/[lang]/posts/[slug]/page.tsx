import TelegramComments from '../../../../components/TelegramComments';
import { getPostData, getAllPostSlugs } from '../../../../utils/mdUtils';
import { getTranslation } from '../../../../contexts/LanguageContext';
import { Language, languages } from '../../../../translations';
import ReactMarkdown from 'react-markdown';
import CustomMarkdown from '../../../../components/CustomMarkdown';
import Comments from '../../../../components/Comments';

interface PostProps {
    params: { lang: Language; slug: string };
}

export async function generateStaticParams() {
    const paths = [];
    for (const lang of languages) {
        const slugs = await getAllPostSlugs(lang);
        for (const slug of slugs) {
            paths.push({ lang, slug });
        }
    }

    return paths;
}

export default async function Post({ params }: PostProps) {
    const { lang, slug } = params;
    const post = await getPostData(slug, lang);

    return (
        <div className="container">
            <main>
                <article className="post">
                    <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {new Date(post.date).toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        {' | '}{getTranslation(lang, 'category')}: {post.category}
                    </p>
                    <CustomMarkdown>{post.content}</CustomMarkdown>
                </article>
                <Comments slug={slug} />
            </main>
        </div>
    );
}