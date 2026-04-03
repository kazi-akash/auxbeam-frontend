import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1rem',
        md: '2rem',
        lg: '2rem',
        xl: '3rem',
        '2xl': '4rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1440px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      colors: {
        // Primary Colors (Yellow/Gold)
        primary: {
          50: '#FFFEF0',
          100: '#FFFACC',
          200: '#FFF799',
          300: '#FFF066',
          400: '#FFE933',
          500: '#FFE200', // Main primary
          600: '#CCB500',
          700: '#998800',
          800: '#665B00',
          900: '#332D00',
        },
        // Gray Colors
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        // Semantic Colors
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
        // Text Colors
        text: {
          primary: '#000000',
          secondary: '#6B7280',
          tertiary: '#9CA3AF',
          inverse: '#FFFFFF',
        },
      },
      fontSize: {
        // H1 - Big 64px
        'h1-big': ['64px', { lineHeight: '120%', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h1-big-tablet': ['64px', { lineHeight: '120%', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h1-big-mobile': ['48px', { lineHeight: '120%', letterSpacing: '-0.02em', fontWeight: '700' }],
        
        // H1 - Small 56px
        'h1-small': ['56px', { lineHeight: '120%', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h1-small-tablet': ['48px', { lineHeight: '120%', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h1-small-mobile': ['40px', { lineHeight: '120%', letterSpacing: '-0.02em', fontWeight: '700' }],
        
        // H2 - 48px
        'h2': ['48px', { lineHeight: '120%', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h2-tablet': ['40px', { lineHeight: '120%', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h2-mobile': ['32px', { lineHeight: '120%', letterSpacing: '-0.02em', fontWeight: '700' }],
        
        // H3 - 40px
        'h3': ['40px', { lineHeight: '130%', letterSpacing: '-0.01em', fontWeight: '700' }],
        'h3-tablet': ['32px', { lineHeight: '130%', letterSpacing: '-0.01em', fontWeight: '700' }],
        'h3-mobile': ['28px', { lineHeight: '130%', letterSpacing: '-0.01em', fontWeight: '700' }],
        
        // H4 - 32px
        'h4': ['32px', { lineHeight: '130%', letterSpacing: '-0.01em', fontWeight: '700' }],
        'h4-tablet': ['28px', { lineHeight: '130%', letterSpacing: '-0.01em', fontWeight: '700' }],
        'h4-mobile': ['24px', { lineHeight: '130%', letterSpacing: '-0.01em', fontWeight: '700' }],
        
        // H5 - 24px
        'h5': ['24px', { lineHeight: '140%', letterSpacing: '0em', fontWeight: '700' }],
        'h5-tablet': ['20px', { lineHeight: '140%', letterSpacing: '0em', fontWeight: '700' }],
        'h5-mobile': ['18px', { lineHeight: '140%', letterSpacing: '0em', fontWeight: '700' }],
        
        // H6 - 20px
        'h6': ['20px', { lineHeight: '140%', letterSpacing: '0em', fontWeight: '700' }],
        'h6-tablet': ['18px', { lineHeight: '140%', letterSpacing: '0em', fontWeight: '700' }],
        'h6-mobile': ['16px', { lineHeight: '140%', letterSpacing: '0em', fontWeight: '700' }],
        
        // Body Large - 18px
        'body-lg': ['18px', { lineHeight: '150%', letterSpacing: '0em', fontWeight: '400' }],
        'body-lg-medium': ['18px', { lineHeight: '150%', letterSpacing: '0em', fontWeight: '500' }],
        'body-lg-semibold': ['18px', { lineHeight: '150%', letterSpacing: '0em', fontWeight: '600' }],
        'body-lg-bold': ['18px', { lineHeight: '150%', letterSpacing: '0em', fontWeight: '700' }],
        
        // Body Medium - 16px
        'body-md': ['16px', { lineHeight: '150%', letterSpacing: '0em', fontWeight: '400' }],
        'body-md-medium': ['16px', { lineHeight: '150%', letterSpacing: '0em', fontWeight: '500' }],
        'body-md-semibold': ['16px', { lineHeight: '150%', letterSpacing: '0em', fontWeight: '600' }],
        'body-md-bold': ['16px', { lineHeight: '150%', letterSpacing: '0em', fontWeight: '700' }],
        
        // Body Small - 14px
        'body-sm': ['14px', { lineHeight: '150%', letterSpacing: '0em', fontWeight: '400' }],
        'body-sm-medium': ['14px', { lineHeight: '150%', letterSpacing: '0em', fontWeight: '500' }],
        'body-sm-semibold': ['14px', { lineHeight: '150%', letterSpacing: '0em', fontWeight: '600' }],
        'body-sm-bold': ['14px', { lineHeight: '150%', letterSpacing: '0em', fontWeight: '700' }],
        
        // Caption - 12px
        'caption': ['12px', { lineHeight: '150%', letterSpacing: '0em', fontWeight: '400' }],
        'caption-medium': ['12px', { lineHeight: '150%', letterSpacing: '0em', fontWeight: '500' }],
        'caption-semibold': ['12px', { lineHeight: '150%', letterSpacing: '0em', fontWeight: '600' }],
        'caption-bold': ['12px', { lineHeight: '150%', letterSpacing: '0em', fontWeight: '700' }],
      },
      spacing: {
        // Custom spacing scale based on your design system
        '0': '0px',
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '7': '28px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '14': '56px',
        '16': '64px',
        '20': '80px',
        '24': '96px',
        '32': '128px',
        '40': '160px',
        '48': '192px',
        '56': '224px',
        '64': '256px',
      },
      borderRadius: {
        'none': '0',
        'sm': '4px',
        'DEFAULT': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '24px',
        'full': '9999px',
      },
    },
  },
  plugins: [],
};

export default config;
