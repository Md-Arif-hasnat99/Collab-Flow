/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── Brutalist Color System (design.md §4) ──────────────────────
        background: '#F7F7F5',
        surface: '#FFFFFF',
        muted: '#EAEAE6',
        border: {
          DEFAULT: '#171717',
          light: '#D1D1CE',
          muted: '#E5E5E2',
        },
        // Primary text
        ink: {
          DEFAULT: '#111111',
          secondary: '#5A5A5A',
          muted: '#777777',
        },
        // Brand accent — warm orange (design.md §4)
        accent: {
          DEFAULT: '#FF6B35',
          hover: '#E85A25',
          light: '#FFF0EB',
          dark: '#CC4A1A',
        },
        // Semantic colors — muted & functional (design.md §4)
        success: {
          DEFAULT: '#2D6A4F',
          light: '#EDF5F1',
          border: '#A8D5C2',
        },
        warning: {
          DEFAULT: '#92600A',
          light: '#FFF8EC',
          border: '#F4C471',
        },
        danger: {
          DEFAULT: '#9B1C1C',
          light: '#FEF2F2',
          border: '#FCA5A5',
        },
        info: {
          DEFAULT: '#1E3A5F',
          light: '#EFF6FF',
          border: '#93C5FD',
        },
        // Dark mode surfaces
        dark: {
          bg: '#0F0F0E',
          surface: '#1A1A18',
          muted: '#252522',
          border: '#2E2E2B',
          'border-light': '#3A3A37',
        },
      },
      fontFamily: {
        // design.md §5 — grotesk for headings, inter for body
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        // design.md §5 typography scale
        'hero': ['clamp(40px,6vw,72px)', { lineHeight: '1.0', letterSpacing: '-0.03em', fontWeight: '700' }],
        'section': ['clamp(28px,4vw,48px)', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'page': ['clamp(22px,3vw,36px)', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '700' }],
        'card': ['clamp(14px,2vw,18px)', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
        'body-lg': ['16px', { lineHeight: '1.6' }],
        'body': ['14px', { lineHeight: '1.6' }],
        'meta': ['12px', { lineHeight: '1.5', letterSpacing: '0.02em' }],
        'label': ['11px', { lineHeight: '1.4', letterSpacing: '0.08em', fontWeight: '600', textTransform: 'uppercase' }],
      },
      borderRadius: {
        // design.md §7 — minimal radius
        none: '0px',
        sm: '2px',
        DEFAULT: '4px',
        md: '4px',
        lg: '6px',
        xl: '8px',
        '2xl': '8px', // Max — never exceed
      },
      boxShadow: {
        // design.md §8 — sparse, brutal
        brutal: '0 2px 0 #171717',
        'brutal-sm': '0 1px 0 #171717',
        'brutal-lg': '0 4px 0 #171717',
        'brutal-accent': '0 2px 0 #FF6B35',
        card: '0 1px 3px rgba(0,0,0,0.08)',
        dropdown: '0 4px 16px rgba(0,0,0,0.12)',
        modal: '0 8px 32px rgba(0,0,0,0.16)',
      },
      spacing: {
        // Content max widths
        'content-sm': '640px',
        'content': '1040px',
        'content-lg': '1400px',
      },
      transitionTimingFunction: {
        'brutal': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        // design.md §30 — subtle functional motion
        'slide-in-from-top': {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-from-bottom': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-from-right': {
          from: { opacity: '0', transform: 'translateX(16px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-from-left': {
          from: { opacity: '0', transform: 'translateX(-16px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.96)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'slide-in-top': 'slide-in-from-top 0.2s ease-brutal',
        'slide-in-bottom': 'slide-in-from-bottom 0.2s ease-brutal',
        'slide-in-right': 'slide-in-from-right 0.25s ease-brutal',
        'slide-in-left': 'slide-in-from-left 0.25s ease-brutal',
        'fade-in': 'fade-in 0.15s ease-out',
        'scale-in': 'scale-in 0.15s ease-brutal',
      },
    },
  },
  plugins: [],
};
