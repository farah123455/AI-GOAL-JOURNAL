/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#12090B',
        foreground: '#E8D8C4',
        text: '#E8D8C4',
        cream: '#E8D8C4',
        beige: '#C7B7A3',
        burgundy: '#561C24',
        wine: '#6D2932',
        border: '#352024',
        
        primary: {
          DEFAULT: '#6D2932',
          dark: '#561C24',
          light: '#8B3A46',
          foreground: '#E8D8C4',
        },
        secondary: {
          DEFAULT: '#211114',
          foreground: '#C7B7A3',
          hover: '#2D171B',
        },
        accent: {
          DEFAULT: '#C7B7A3',
          foreground: '#12090B',
          muted: 'rgba(199, 183, 163, 0.15)',
        },
        muted: {
          DEFAULT: '#211114',
          foreground: '#9F8F82',
          border: '#352024',
        },
        card: {
          DEFAULT: '#180E10',
          elevated: '#211114',
          border: '#352024',
        },
        surface: {
          DEFAULT: '#190D0F',
          surface2: '#211114',
          elevated: '#211114',
          border: '#352024',
        },
        status: {
          success: '#10B981',
          'success-bg': 'rgba(16, 185, 129, 0.12)',
          warning: '#F59E0B',
          'warning-bg': 'rgba(245, 158, 11, 0.12)',
          error: '#EF4444',
          'error-bg': 'rgba(239, 68, 68, 0.15)',
          info: '#C7B7A3',
          'info-bg': 'rgba(199, 183, 163, 0.12)',
        }
      },
      backgroundImage: {
        'primary-grad': 'linear-gradient(135deg, #6D2932 0%, #561C24 100%)',
        'ai-grad': 'linear-gradient(135deg, #6D2932 0%, #C7B7A3 100%)',
        'dark-surface': 'linear-gradient(135deg, #12090B 0%, #211114 100%)',
        'card-grad': 'linear-gradient(145deg, #190D0F 0%, #12090B 100%)',
        'voice-grad': 'linear-gradient(135deg, #190D0F 0%, #211114 60%, #180E10 100%)',
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        panel: '18px',
        card: '14px',
      },
      boxShadow: {
        card: '0 10px 35px rgba(0, 0, 0, 0.22)',
        glow: '0 12px 40px rgba(86, 28, 36, 0.16)',
        'glow-primary': '0 0 25px -5px rgba(109, 41, 50, 0.4)',
      },
    },
  },
  plugins: [],
}
