'use client';

import { useState } from 'react';
import { usePathname, useParams } from 'next/navigation';
import Link from 'next/link';
import { Language, languages, getTranslations } from '../translations';
import tagTranslations from '../tagTranslations.json';


interface TagTranslation {
  cn: string;
  en: string;
  ja: string;
}

export default function LanguageSelector() {
  const pathname = usePathname();
  const params = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const currentLang = (params?.lang as Language) || 'en';
  const translations = getTranslations(currentLang);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const getTranslatedTag = (currentTag: string, targetLang: string) => {
    const tagEntry = tagTranslations.find((entry) => entry[currentLang as keyof TagTranslation] === currentTag);
    return tagEntry ? tagEntry[targetLang as keyof TagTranslation] : currentTag;
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {translations.langName}
        <svg className="w-5 h-5 ml-2 -mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 w-56 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
          {languages.map((langCode) => {
              let newPath;
              const currentTagArray = params?.tag;
              const currentTag: string = Array.isArray(currentTagArray) ? currentTagArray[0] : currentTagArray || '';
              if (pathname.startsWith(`/${currentLang}/tag/`)) {
                const decodedTag = decodeURIComponent(currentTag);
                const translatedTag = getTranslatedTag(decodedTag, langCode);
                newPath = `/${langCode}/tag/${encodeURIComponent(translatedTag)}`;
              } else {
                newPath = `/${langCode}${pathname.substring(3)}`;
              }
              return (
                <Link
                  key={langCode}
                  href={newPath}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  role="menuitem"
                  onClick={toggleDropdown}
                >
                  {getTranslations(langCode).langName}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}