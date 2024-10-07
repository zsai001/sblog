'use client';

import React, { useEffect, useState } from 'react';
import Giscus from '@giscus/react';
import {useTheme} from '../contexts/ThemeContext'

interface CommentsProps {
  slug: string;
}

export default function Comments({ slug }: CommentsProps) {
  const { theme } = useTheme();
  const [giscusTheme, setGiscusTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    setGiscusTheme(theme === 'dark' ? 'dark' : 'light');
  }, [theme]);

  return (
    <div className="mt-10">
      <Giscus
        repo="zsai001/sblog"
        repoId="R_kgDOM02qyg"
        category="General"
        categoryId="DIC_kwDOM02qys4CjJPT"
        mapping="pathname"
        term={slug}
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={giscusTheme}
        lang="en"
        loading="lazy"
      />
    </div>
  );
}