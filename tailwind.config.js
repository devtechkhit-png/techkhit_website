/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html"],
  theme: {
    extend: {
      colors: {
        background: '#111d2e', // Deep Obsidian Dark
        card: '#15243b',       // Lighter obsidian for cards
        border: '#22354f',     // Custom border
        primary: {
          DEFAULT: '#f3c614',  // Signature Amber Gold
          foreground: '#111d2e'
        },
        muted: {
          DEFAULT: '#1b2c45',
          foreground: '#94a3b8'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      }
    }
  },
  plugins: [],
}
