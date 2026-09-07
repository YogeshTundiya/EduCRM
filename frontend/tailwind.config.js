/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FFF5F1',
          100: '#FFE8DF',
          200: '#FFD1BF',
          500: '#FF5B26', // Main coral/orange accent from screenshot
          600: '#EE4A15',
          700: '#D43C0A',
        },
        obsidian: {
          800: '#22252A',
          900: '#141619',
          950: '#0E1012',
        },
        canvas: {
          light: '#F4F5F8',
          dark: '#0B0D0F'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 6px 24px -4px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.02)',
        'card-hover': '0 12px 32px -6px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.02)',
        'pill': '0 2px 10px rgba(0, 0, 0, 0.04)',
        'orange-glow': '0 8px 24px -4px rgba(255, 91, 38, 0.35)',
      },
      borderRadius: {
        '4xl': '2rem',
        '3xl': '1.5rem',
        '2xl': '1.25rem',
      }
    },
  },
  plugins: [],
}
