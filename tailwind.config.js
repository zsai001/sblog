module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        light: {
          background: '#ffffff',
          backgroundSoft: '#f0f4f8',
          text: '#333333',
          primary: '#4a5568',
          secondary: '#718096',
          accent: '#48bb78', // 这是搜索按钮的绿色，我们将用它作为标签的默认颜色
        },
        dark: {
          background: '#1a202c',
          backgroundSoft: '#2d3748',
          text: '#e2e8f0',
          primary: '#a0aec0',
          secondary: '#718096',
          accent: '#48bb78',
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};