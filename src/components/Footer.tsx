import { getTranslation } from '../contexts/LanguageContext';
import { Language } from '../translations';

export default function Footer({ lang }: { lang: Language }) {
    return (
        <footer className="mt-auto py-4">
            <p>{getTranslation(lang, 'footer')}</p>
        </footer>
    );
}