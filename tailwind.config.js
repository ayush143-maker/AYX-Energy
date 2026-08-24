/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ayx: {
          paper: '#F7F7F5',
          white: '#FFFFFF',
          ink: '#111111',
          muted: '#6B7280',
          line: '#E5E7EB',
          accent: '#0047FF', // Clean electric blue
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
