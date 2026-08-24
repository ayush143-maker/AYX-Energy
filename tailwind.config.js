/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ayx: {
          black: '#02040a',
          ink: '#060912',
          surface: '#0a0f1c',
          deep: '#050810',
          cyan: '#00e6ff',
          electric: '#22d3ee',
          violet: '#7c5cff',
          plasma: '#c026ff',
          steel: '#9fb4cc',
          silver: '#cfd8e3',
        },
      },
      fontFamily: {
        display: ['Orbitron', 'system-ui', 'sans-serif'],
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 30s linear infinite',
      },
    },
  },
  plugins: [],
};
