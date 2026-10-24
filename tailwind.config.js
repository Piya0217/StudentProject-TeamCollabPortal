/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Design token color mappings — CSS variables are source of truth
        canvas: 'var(--canvas)',
        surface: 'var(--surface)',
        'surface-raised': 'var(--surface-raised)',
        ink: 'var(--ink)',
        'ink-secondary': 'var(--ink-secondary)',
        accent: 'var(--accent)',
        hairline: 'var(--hairline)',

        // Status tokens
        'status-todo': 'var(--status-todo)',
        'status-in-progress': 'var(--status-in-progress)',
        'status-in-review': 'var(--status-in-review)',
        'status-done': 'var(--status-done)',

        // Priority tokens
        'priority-high': 'var(--priority-high)',
        'priority-medium': 'var(--priority-medium)',
        'priority-low': 'var(--priority-low)',

        // Health tokens
        'health-ontrack': 'var(--health-ontrack)',
        'health-atrisk': 'var(--health-atrisk)',
        'health-overdue': 'var(--health-overdue)',
      },

      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          'Inter',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
      },

      fontSize: {
        // Type scale from design tokens
        'display': ['3.5rem', { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '600' }],
        'title-1': ['2.125rem', { lineHeight: '1.12', letterSpacing: '-0.022em', fontWeight: '700' }],
        'title-2': ['1.5rem', { lineHeight: '1.20', letterSpacing: '-0.018em', fontWeight: '600' }],
        'headline': ['1.0625rem', { lineHeight: '1.30', letterSpacing: '-0.01em', fontWeight: '600' }],
        'body': ['0.9375rem', { lineHeight: '1.50', letterSpacing: '0em', fontWeight: '400' }],
        'caption': ['0.75rem', { lineHeight: '1.40', letterSpacing: '0.01em', fontWeight: '500' }],
      },

      borderRadius: {
        'chip': '8px',
        'control': '10px',
        'card': '16px',
        'sheet': '24px',
        'window': '28px',
      },

      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
        '20': '80px',
        '24': '96px',
      },

      maxWidth: {
        'content': '1280px',
      },

      boxShadow: {
        'chip': '0 1px 2px rgba(0, 0, 0, 0.04)',
        'control': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'card': '0 4px 12px rgba(0, 0, 0, 0.04)',
        'card-raised': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'sheet': '0 12px 36px rgba(0, 0, 0, 0.12)',
        'window': '0 24px 64px rgba(0, 0, 0, 0.16)',
      },

      transitionTimingFunction: {
        'ease-out': 'cubic-bezier(0.23, 1, 0.32, 1)',
        'ease-in-out': 'cubic-bezier(0.77, 0, 0.175, 1)',
        'ease-drawer': 'cubic-bezier(0.32, 0.72, 0, 1)',
      },

      transitionDuration: {
        'press': '100ms',
        'tooltip': '125ms',
        'dropdown': '160ms',
        'modal': '240ms',
        'sheet': '320ms',
        'theme': '300ms',
        'route': '200ms',
        'progress': '400ms',
      },

      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'ring-pulse': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '60%': { transform: 'scale(1.15)', opacity: '0.4' },
          '100%': { transform: 'scale(1)', opacity: '0' },
        },
      },

      animation: {
        'shimmer': 'shimmer 2s linear infinite',
        'fade-in': 'fade-in 200ms cubic-bezier(0.23, 1, 0.32, 1)',
        'scale-in': 'scale-in 200ms cubic-bezier(0.23, 1, 0.32, 1)',
        'ring-pulse': 'ring-pulse 400ms cubic-bezier(0.23, 1, 0.32, 1)',
      },
    },
  },
  plugins: [],
}
