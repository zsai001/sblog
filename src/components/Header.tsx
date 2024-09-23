import Link from 'next/link';
import { getTranslation } from '../contexts/LanguageContext';
import { Language } from '../translations';
import ThemeToggle from './ThemeToggle';
import LanguageSelector from './LanguageSelector';
interface HeaderProps {
    tags: string[];
    lang: Language;
}

export default function Header({ tags, lang }: HeaderProps) {
    return (
        <header className="relative text-center py-10">
            <div className="flex flex-col items-center mb-4">
                <h1 className="text-4xl font-bold mb-2">{getTranslation(lang, 'title')}</h1>
                <p className="text-xl mb-6">{getTranslation(lang, 'subtitle')}</p>
                <div className="flex items-center">
                    <ThemeToggle />
                    <div className="ml-4">
                        <LanguageSelector />
                    </div>
                </div>
            </div>
            <nav className="mb-6 flex justify-center items-center">
                <Link href={`/${lang}`} className="mx-4 font-bold hover:text-green-600 dark:hover:text-green-400">{getTranslation(lang, 'home')}</Link>
                <Link href={`/${lang}/about`} className="mx-4 font-bold hover:text-green-600 dark:hover:text-green-400">{getTranslation(lang, 'about')}</Link>
                <Link href={`/${lang}/archive`} className="mx-4 font-bold hover:text-green-600 dark:hover:text-green-400">{getTranslation(lang, 'archive')}</Link>
                <Link href={`/${lang}/contact`} className="mx-4 font-bold hover:text-green-600 dark:hover:text-green-400">{getTranslation(lang, 'contact')}</Link>
            </nav>
            <div className="search-container">
                <div className="search-wrapper">
                    <input
                        type="text"
                        id="search-input"
                        placeholder={getTranslation(lang, 'searchPlaceholder')}
                        className="bg-white dark:bg-gray-800"
                        aria-label={getTranslation(lang, 'searchPlaceholder')}
                    />
                    <button id="search-button" aria-label={getTranslation(lang, 'searchButton')}>{getTranslation(lang, 'searchButton')}</button>
                </div>
            </div>
        </header>
    );
}