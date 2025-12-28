import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#1A365D', // Deep Navy
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#00AEEF', // Electric Blue
          foreground: '#ffffff',
        },
        destructive: {
          DEFAULT: '#666666', // Gray
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: '#CBD5E0', // Silver Metallic
          foreground: '#2D3748',
        },
        accent: {
          DEFAULT: '#CBD5E0', // Silver Metallic
          foreground: '#2D3748',
        },
        popover: {
          DEFAULT: '#F7FAFC',
          foreground: '#2D3748',
        },
        card: {
          DEFAULT: '#F7FAFC',
          foreground: '#2D3748',
        },
        // Custom color palette
        brand: {
          dark: '#1A365D', // Deep Navy
          medium: '#00AEEF', // Electric Blue
          brown: '#2D3748', // Charcoal Grey
          beige: '#CBD5E0', // Silver Metallic
        },
        // Grayscale palette (kept for compatibility)
        gray: {
          50: '#F9F9F9',
          100: '#F5F5F5',
          200: '#F0F0F0',
          300: '#E5E5E5',
          400: '#CCCCCC',
          500: '#999999',
          600: '#666666',
          700: '#4D4D4D',
          800: '#333333',
          900: '#1A1A1A',
          950: '#000000',
        },
      },
      borderRadius: {
        lg: '8px',
        md: '6px',
        sm: '4px',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
