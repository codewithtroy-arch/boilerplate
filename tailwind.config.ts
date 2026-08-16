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
        // Clinical/lab-label palette — stark white/black base, one bold
        // accent. Grounded in skincare's own visual world (ingredient
        // labels, dermatology charts, batch codes) rather than a soft
        // pastel default.
        ink: '#141414',
        paper: '#FAFAF8',
        cobalt: '#1E3FE0',
        blush: '#D64545', // functional alert/warning red, not decorative
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.25rem',
        sm: '0.125rem',
      },
    },
  },
  plugins: [],
};

export default config;
