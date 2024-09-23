import React from 'react';
import ReactMarkdown, { Components } from 'react-markdown';

interface CustomMarkdownProps {
    children: string;
}

const CustomMarkdown: React.FC<CustomMarkdownProps> = ({ children }) => {
    const components: Components = {
        h1: ({ node, ...props }) => <h1 className="sr-only" {...props} />,
        h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mt-5 mb-3" {...props} />,
        h3: ({ node, ...props }) => <h3 className="text-xl font-bold mt-4 mb-2" {...props} />,
        p: ({ node, ...props }) => <p className="mb-4" {...props} />,
        ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4" {...props} />,
        ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4" {...props} />,
        li: ({ node, ...props }) => <li className="mb-1" {...props} />,
        a: ({ node, ...props }) => <a className="text-blue-600 hover:underline" {...props} />,
    };

    return <ReactMarkdown components={components}>{children}</ReactMarkdown>;
};

export default CustomMarkdown;