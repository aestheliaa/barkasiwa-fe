import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1e4fa1',
          dark: '#163a7a',
        },
        accent: {
          DEFAULT: '#ff8c42',
          dark: '#e67a35',
        },
        success: {
          DEFAULT: '#42b72a',
          dark: '#36a420',
        },
        'card-blue': '#8bb7f0',
        'hover-blue': '#eaf0ff',
        'bg-gray': '#f5f7fb',
      },
    },
  },
  plugins: [],
};

export default config;
