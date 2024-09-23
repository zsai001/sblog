'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const userLang = navigator.language
    let lang = 'en'; // 默认语言为英语

    if (userLang.startsWith('zh')) {
      lang = 'zh';
    } else if (userLang.startsWith('en')) {
      lang = 'en';
    }
    // 可以根据需要添加更多语言判断

    router.push(`/${lang}`);
  }, [router]);

  return null; // 或者返回一个加载指示器
}