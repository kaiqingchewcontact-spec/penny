/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Surfaces
        bg: '#FFF8F3',
        'bg-elev': '#FFFFFF',
        'bg-tint': '#FFEFE4',
        'bg-tint-2': '#FFE3D6',
        line: '#F0E1D2',
        'line-strong': '#E5D0BC',
        // Ink
        ink: '#2A1F18',
        'ink-2': '#5C4A3D',
        'ink-3': '#8B7868',
        'ink-4': '#B8A595',
        // Accents
        peach: '#FFB4A2',
        'peach-deep': '#F08A6E',
        pink: '#F8B4D9',
        'pink-deep': '#E879B5',
        lavender: '#C4B5FD',
        'lavender-deep': '#8B73E8',
        sun: '#FFD166',
        'sun-deep': '#F5B43A',
        mint: '#9FD8B8',
        'mint-deep': '#4FB07F',
        // Semantic
        good: '#4FB07F',
        warn: '#F5B43A',
        bad: '#FF7A7A',
      },
      fontFamily: {
        serif: ['Fraunces', 'Source Serif Pro', 'Georgia', 'serif'],
        sans: ['Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      animation: {
        'bubble-in': 'bubble-in .35s cubic-bezier(.2,.8,.2,1)',
        'typing': 'typing 1.1s infinite ease-in-out',
      },
      keyframes: {
        'bubble-in': {
          from: { opacity: '0', transform: 'translate3d(0, 6px, 0)' },
          to: { opacity: '1', transform: 'translate3d(0, 0, 0)' },
        },
        'typing': {
          '0%, 60%, 100%': { transform: 'translate3d(0, 0, 0)', opacity: '.4' },
          '30%': { transform: 'translate3d(0, -3px, 0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
