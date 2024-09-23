import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import ReactMarkdown from 'react-markdown';
import { getAboutContent } from '../../../utils/mdUtils';
import { Language, languages } from '../../../translations';
import CustomMarkdown from '../../../components/CustomMarkdown';

interface AboutProps {
    params: { lang: string };
}

export async function generateStaticParams() {
    return languages.map(lang => ({
        lang,
    }));
}

export default async function About({ params }: AboutProps) {
    const { lang } = params as { lang: 'en' | 'zh' };
    const { title, content } = await getAboutContent(lang);

    return (
        <div className="container">
            <main>
                <h1 className="text-3xl font-bold mb-4">{title}</h1>
                <CustomMarkdown>{content}</CustomMarkdown>
            </main>
        </div>
    );
}