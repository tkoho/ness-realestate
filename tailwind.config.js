/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        'primary': '#1E40AF', // Deep blue (primary) - blue-800
        'primary-50': '#EFF6FF', // Very light blue (50-level shade) - blue-50
        'primary-100': '#DBEAFE', // Light blue (100-level shade) - blue-100
        'primary-500': '#3B82F6', // Medium blue (500-level shade) - blue-500
        'primary-600': '#2563EB', // Medium-dark blue (600-level shade) - blue-600
        'primary-700': '#1D4ED8', // Dark blue (700-level shade) - blue-700
        
        // Secondary Colors
        'secondary': '#64748B', // Sophisticated slate - slate-500
        'secondary-50': '#F8FAFC', // Very light slate (50-level shade) - slate-50
        'secondary-100': '#F1F5F9', // Light slate (100-level shade) - slate-100
        'secondary-200': '#E2E8F0', // Light-medium slate (200-level shade) - slate-200
        'secondary-300': '#CBD5E1', // Medium-light slate (300-level shade) - slate-300
        'secondary-400': '#94A3B8', // Medium slate (400-level shade) - slate-400
        'secondary-600': '#475569', // Medium-dark slate (600-level shade) - slate-600
        'secondary-700': '#334155', // Dark slate (700-level shade) - slate-700
        'secondary-800': '#1E293B', // Very dark slate (800-level shade) - slate-800
        'secondary-900': '#0F172A', // Near-black slate (900-level shade) - slate-900
        
        // Accent Colors
        'accent': '#059669', // Vibrant emerald - emerald-600
        'accent-50': '#ECFDF5', // Very light emerald (50-level shade) - emerald-50
        'accent-100': '#D1FAE5', // Light emerald (100-level shade) - emerald-100
        'accent-500': '#10B981', // Medium emerald (500-level shade) - emerald-500
        'accent-700': '#047857', // Dark emerald (700-level shade) - emerald-700
        
        // Background Colors
        'background': '#F8FAFC', // Clean off-white - slate-50
        'surface': '#FFFFFF', // Pure white - white
        
        // Text Colors
        'text-primary': '#0F172A', // Near-black - slate-900
        'text-secondary': '#475569', // Medium gray - slate-600
        
        // Status Colors
        'success': '#10B981', // Fresh green - emerald-500
        'success-50': '#ECFDF5', // Very light green (50-level shade) - emerald-50
        'success-100': '#D1FAE5', // Light green (100-level shade) - emerald-100
        'success-600': '#059669', // Medium-dark green (600-level shade) - emerald-600
        
        'warning': '#F59E0B', // Warm amber - amber-500
        'warning-50': '#FFFBEB', // Very light amber (50-level shade) - amber-50
        'warning-100': '#FEF3C7', // Light amber (100-level shade) - amber-100
        'warning-600': '#D97706', // Medium-dark amber (600-level shade) - amber-600
        
        'error': '#EF4444', // Clear red - red-500
        'error-50': '#FEF2F2', // Very light red (50-level shade) - red-50
        'error-100': '#FEE2E2', // Light red (100-level shade) - red-100
        'error-600': '#DC2626', // Medium-dark red (600-level shade) - red-600
        
        // Border Colors
        'border': '#E2E8F0', // Light gray border - slate-200
        'border-focus': '#1E40AF', // Primary blue for focus states - blue-800
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        'data': ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      zIndex: {
        '1000': '1000',
        '1010': '1010',
        '1020': '1020',
        '1030': '1030',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      transitionDuration: {
        '200': '200ms',
        '250': '250ms',
        '300': '300ms',
      },
      boxShadow: {
        'soft': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'elevated': '0 10px 25px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
}