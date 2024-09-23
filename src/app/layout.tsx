import '../styles/globals.css';
import { Inter } from 'next/font/google';
import Footer from '../components/Footer';
const inter = Inter({ subsets: ['latin'] });
import { ThemeProvider } from '../contexts/ThemeContext';


export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={`${inter.className} flex flex-col min-h-screen`}>
                <ThemeProvider>
                <div className="flex-grow">
                    {children}
                </div>
                </ThemeProvider>
            </body>
        </html>
    );
}