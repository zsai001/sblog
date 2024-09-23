import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { getContactContent } from '../../../utils/mdUtils';
import { FaTwitter, FaGithub } from 'react-icons/fa';
import { Language, languages } from '../../../translations';

interface ContactProps {
    params: { lang: string };
}

export async function generateStaticParams() {
    return languages.map(lang => ({
        lang,
    }));
}

export default async function Contact({ params }: ContactProps) {
    const { lang } = params as { lang: 'en' | 'zh' };
    const { title, content } = await getContactContent(lang);

    return (
        <div className="container">
            <main>
                <h1 className="text-3xl font-bold mb-4">{title}</h1>
                <div dangerouslySetInnerHTML={{ __html: content }} />
                <div className="mt-6 flex space-x-4">
                    <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-500">
                        <FaTwitter size={24} />
                    </a>
                    <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-gray-900 dark:text-gray-200 dark:hover:text-gray-100">
                        <FaGithub size={24} />
                    </a>
                </div>
            </main>
        </div>
    );
}