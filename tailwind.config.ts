import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        bangers: ['Bangers', 'cursive'],
        nunito:  ['Nunito', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
