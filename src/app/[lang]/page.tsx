import BlogPost from '../../components/BlogPost';
import { getAllPostSlugs, getPostData, getAllTags } from '../../utils/mdUtils';
import Tags from '../../components/Tags';
import { Language, languages } from '../../translations';

interface HomeProps {
  params: { lang: Language };
}

interface Post {
  slug: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  tags: string[];
  content: string;
}

export async function generateStaticParams() {
  return languages.map((lang) => ({
    lang: lang,
  }));
}

export default async function Home({ params }: HomeProps) {
  const lang = params.lang;
  const slugs = await getAllPostSlugs(lang);
  const posts: Post[] = await Promise.all(slugs.map(slug => getPostData(slug, lang)));
  const tags = await getAllTags(lang);

  return (
    <div className="container">
      <main>
        <Tags tags={tags} lang={lang} />
        {posts.map(post => (
          <BlogPost
            key={post.slug}
            slug={post.slug}
            title={post.title}
            date={post.date}
            category={post.category}
            summary={post.summary}
            lang={lang}
            tags={post.tags || []}
          />
        ))}
      </main>
    </div>
  );
}