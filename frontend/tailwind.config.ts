import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FE2C55',
          light: '#FF004F',
          dark: '#E6254C',
          '25': 'rgba(254, 44, 85, 0.25)',
          '50': 'rgba(254, 44, 85, 0.5)'
        },
        secondary: {
          DEFAULT: '#00F2EA',
          light: '#00C4FF',
          dark: '#00D6D0',
          '25': 'rgba(0, 242, 234, 0.25)',
          '50': 'rgba(0, 242, 234, 0.5)'
        },
        accent: {
          DEFAULT: '#69C9D0',
          light: '#00F2EA',
          dark: '#5BB5BC',
          '25': 'rgba(105, 201, 208, 0.25)',
          '50': 'rgba(105, 201, 208, 0.5)'
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: 'hsl(var(--card))',
        'card-foreground': 'hsl(var(--card-foreground))',
        muted: 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(254, 44, 85, 0.35)',
        'glow-secondary': '0 0 20px rgba(0, 242, 234, 0.35)',
        'glow-accent': '0 0 20px rgba(105, 201, 208, 0.35)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 1.5s cubic-bezier(0.24, 0, 0.38, 1) infinite',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.8)', opacity: '0.5' },
          '100%': { transform: 'scale(1.2)', opacity: '0' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
