import { getPostsByTag, getAllTags } from '../../../../utils/mdUtils';
import BlogPost from '../../../../components/BlogPost';
import { getTranslation } from '../../../../contexts/LanguageContext';
import Tags from '../../../../components/Tags';
import { Language, languages } from '../../../../translations';

interface TagPageProps {
  params: { lang: Language; tag: string };
}

interface StaticParam {
  lang: string;
  tag: string;
}

export async function generateStaticParams(): Promise<StaticParam[]> {
  const params: StaticParam[] = [];

  const allTags = await Promise.all(languages.map(lang => getAllTags(lang)));

  for (const lang of languages) {
    for (const tags of allTags) {
      for (const tag of tags) {
        params.push({ 
          lang, 
          tag: encodeURIComponent(tag) // 确保标签被正确编码
        });
      }
    }
  }

  return params;
}

export default async function TagPage({ params }: TagPageProps) {
  const { lang, tag } = params;
  const decodedTag = decodeURIComponent(tag);
  const posts = await getPostsByTag(decodedTag, lang);
  const tags = await getAllTags(lang);
  
  return (
    <div className="container">
      <main>
        <Tags tags={tags} lang={lang} />
        <h1 className="text-3xl font-bold mb-4">
          {getTranslation(lang, 'postsTaggedWith')} <span className="italic">#{decodedTag}</span>
        </h1>
        {posts.map((post) => (
          <BlogPost
            key={post.slug}
            slug={post.slug}
            title={post.title}
            date={post.date}
            category={post.category}
            summary={post.summary}
            lang={lang}
            tags={post.tags || []} // 添加这一行
          />
        ))}
      </main>
    </div>
  );
}