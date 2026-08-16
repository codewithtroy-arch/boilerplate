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
        // Vibrant mobile-app palette — confident, saturated, playful.
        ink: '#1A1A2E',
        paper: '#FFFFFF',
        cobalt: '#FF4785', // magenta — primary accent (kept key name so
                            // every existing bg-cobalt/text-cobalt class
                            // across the app updates automatically)
        violet: '#6C5CE7', // secondary accent
        sun: '#FFB800',    // tertiary accent
        blush: '#E63950',  // functional alert/warning red
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
      },
      borderRadius: {
        lg: '1.25rem',
        md: '0.75rem',
        sm: '0.5rem',
      },
    },
  },
  plugins: [],
};

export default config;
