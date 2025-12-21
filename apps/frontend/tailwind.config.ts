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
          DEFAULT: '#0E2F3E', // Dark blue
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#9A7C64', // Brown/bronze
          foreground: '#ffffff',
        },
        destructive: {
          DEFAULT: '#666666', // Gray
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: '#D9C6B8', // Light beige
          foreground: '#0E2F3E',
        },
        accent: {
          DEFAULT: '#196886', // Medium blue
          foreground: '#ffffff',
        },
        popover: {
          DEFAULT: '#ffffff',
          foreground: '#0E2F3E',
        },
        card: {
          DEFAULT: '#ffffff',
          foreground: '#0E2F3E',
        },
        // Custom color palette
        brand: {
          dark: '#0E2F3E',
          medium: '#196886',
          brown: '#9A7C64',
          beige: '#D9C6B8',
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
