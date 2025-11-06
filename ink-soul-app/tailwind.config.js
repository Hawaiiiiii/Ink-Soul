/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          primary: '#0C0C0C',
          elevated: '#141414',
          hover: '#1C1C1C',
        },
        accent: {
          gold: '#C1A261',
          'gold-light': '#D4C088',
          'gold-dark': '#9A8450',
          burgundy: '#6B1E24',
          'burgundy-light': '#8A2A31',
          indigo: '#2E356D',
        },
        text: {
          primary: '#EAEAEA',
          secondary: '#B8B8B8',
          tertiary: '#8A8A8A',
        },
        border: {
          gold: 'rgba(193, 162, 97, 0.3)',
          subtle: 'rgba(255, 255, 255, 0.08)',
        },
        overlay: {
          burgundy: 'rgba(107, 30, 36, 0.6)',
          indigo: 'rgba(46, 53, 109, 0.4)',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      fontSize: {
        'display': '96px',
        'h1': '72px',
        'h2': '56px',
        'h3': '40px',
        'body-large': '24px',
        'body': '18px',
        'small': '14px',
        'button': '16px',
      },
      spacing: {
        'xs': '8px',
        'sm': '16px',
        'md': '24px',
        'lg': '32px',
        'xl': '48px',
        '2xl': '64px',
        '3xl': '96px',
        '4xl': '128px',
        'hero': '160px',
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        'full': '9999px',
      },
      boxShadow: {
        'card': '0 0 0 1px rgba(193, 162, 97, 0.2), 0 4px 12px rgba(0, 0, 0, 0.5), 0 8px 24px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 0 0 1px rgba(193, 162, 97, 0.4), 0 8px 24px rgba(0, 0, 0, 0.6), 0 12px 32px rgba(0, 0, 0, 0.4)',
        'modal': '0 0 0 1px rgba(193, 162, 97, 0.3), 0 24px 48px rgba(0, 0, 0, 0.7), 0 12px 24px rgba(0, 0, 0, 0.5)',
        'glow-gold': '0 0 20px rgba(193, 162, 97, 0.5), 0 0 40px rgba(193, 162, 97, 0.3), 0 0 60px rgba(193, 162, 97, 0.15)',
        'glow-gold-intense': '0 0 30px rgba(193, 162, 97, 0.7), 0 0 60px rgba(193, 162, 97, 0.5), 0 0 90px rgba(193, 162, 97, 0.25)',
        'glow-burgundy': '0 0 20px rgba(107, 30, 36, 0.4), 0 0 40px rgba(107, 30, 36, 0.2)',
      },
      transitionDuration: {
        'fast': '250ms',
        'standard': '400ms',
        'slow': '500ms',
        'ritual': '600ms',
      },
      transitionTimingFunction: {
        'material': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'elegance': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      screens: {
        'xs': '0px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      maxWidth: {
        'container-sm': '100%',
        'container-md': '100%',
        'container-lg': '1200px',
        'container-xl': '1400px',
        'container-2xl': '1600px',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.25s ease-out',
      },
    },
  },
  plugins: [],
}
