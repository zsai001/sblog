import { getTranslations, Language, Translations, languages } from '../translations';

export function getTranslation(lang: Language, key: keyof Translations): string {
    const translations = getTranslations(lang);
    return translations && key in translations ? translations[key] : key;
}

export function getSupportedLanguages(): Language[] {
    return languages;
}

export function getDefaultLanguage(): Language {
    return 'en';
}