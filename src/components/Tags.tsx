'use client'

import Link from 'next/link';
import { Language } from '../translations';
import { useState, useRef, useEffect } from 'react';
import { getTranslation } from '../contexts/LanguageContext';

interface TagsProps {
    tags: string[];
    lang: Language;
}

export default function Tags({ tags, lang }: TagsProps) {
    const [showAll, setShowAll] = useState(false);
    const [firstRowTags, setFirstRowTags] = useState<string[]>([]);
    const [remainingTags, setRemainingTags] = useState<string[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            const container = containerRef.current;
            const containerWidth = container.offsetWidth;
            let totalWidth = 0;
            let firstRow: string[] = [];
            let remaining: string[] = [];

            // 创建一个临时的 span 元素来测量标签宽度
            const tempSpan = document.createElement('span');
            tempSpan.style.visibility = 'hidden';
            tempSpan.style.position = 'absolute';
            tempSpan.className = 'tag';
            document.body.appendChild(tempSpan);

            tags.forEach((tag) => {
                tempSpan.textContent = tag;
                const tagWidth = tempSpan.offsetWidth;
                if (totalWidth + tagWidth <= containerWidth) {
                    totalWidth += tagWidth;
                    firstRow.push(tag);
                } else {
                    remaining.push(tag);
                }
            });

            document.body.removeChild(tempSpan);

            setFirstRowTags(firstRow);
            setRemainingTags(remaining);
        }
    }, [tags]);

    return (
        <div className="tags mb-5 text-center" ref={containerRef}>
            {(showAll ? tags : firstRowTags).map((tag) => (
                <Link
                    key={tag}
                    href={`/${lang}/tag/${encodeURIComponent(tag)}`}
                    className="tag inline-block py-1 px-3 mr-2 mb-2 rounded-full text-sm transition-colors duration-300 bg-light-accent text-white hover:bg-light-secondary dark:bg-dark-secondary dark:text-dark-text dark:hover:bg-dark-accent"
                >
                    <span className="italic">#{tag}</span>
                </Link>
            ))}
            {remainingTags.length > 0 && (
                <button
                    onClick={() => setShowAll(!showAll)}
                    className="tag inline-block py-1 px-3 mr-2 mb-2 rounded-full text-sm transition-colors duration-300 bg-light-accent text-white hover:bg-light-secondary dark:bg-dark-secondary dark:text-dark-text dark:hover:bg-dark-accent cursor-pointer"
                >
                    {showAll ? getTranslation(lang, 'collapse') : `${getTranslation(lang, 'more')} (${remainingTags.length})`}
                </button>
            )}
        </div>
    );
}