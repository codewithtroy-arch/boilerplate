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
        // Lumina palette — ported from the uploaded design.
        ink: '#2C2C2C',
        paper: '#FFFFFF',
        marble: '#F9F7F5',
        pink: '#F8B4C4',
        'pink-dark': '#E89AAA',
        'pink-soft': '#FDF2F5',
        sage: '#A8C5B0',
        'sage-dark': '#8FAD98',
        'sage-soft': '#F0F5F1',
        cream: '#D4C4B0',
        'text-light': '#6B6B6B',
        blush: '#D64545', // functional alert/warning red
      },
      fontFamily: {
        display: ['var(--font-display)', 'Cormorant Garamond', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: '1rem',
        md: '0.5rem',
        sm: '0.25rem',
      },
    },
  },
  plugins: [],
};

export default config;
