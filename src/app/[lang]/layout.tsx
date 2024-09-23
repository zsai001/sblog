import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Language } from '../../translations';
import { getAllTags } from '../../utils/mdUtils';


export default async function Layout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { lang: Language };
}) {
  const { lang } = params;
  const tags = await getAllTags(lang);

  return (
    <div className="flex flex-col min-h-screen">
      <Header tags={tags} lang={lang} />
      <main className="flex-grow container mx-auto px-4">
        {children}
      </main>
      <Footer lang={lang} />
    </div>
  );
}