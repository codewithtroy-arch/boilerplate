import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        // Catalog storefront palette — soft blush hero, vivid rose accent.
        // Admin keeps the calmer ivory/gold palette below; the storefront
        // gets more expressive, since it's the customer-facing "brand".
        ink: '#241F1F',
        paper: '#FBF6F1',
        blush: '#B97A82',
        sage: '#7C8A6E',
        gold: '#A98240',
        blossom: '#FDF1F0',
        rose: '#E85D75',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.25rem',
      },
    },
  },
  plugins: [],
};

export default config;
