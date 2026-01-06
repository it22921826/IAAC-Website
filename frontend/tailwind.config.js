/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['Montserrat', 'Inter', 'system-ui', 'sans-serif'],
        poppins: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          primary: '#2563EB',
          accent: '#38BDF8',
        },
        base: {
          dark: '#020617',
          soft: '#0F172A',
          light: '#F8FAFC',
        },
      },
      boxShadow: {
        'brand-glow': '0 0 15px rgba(37, 99, 235, 0.3)',
        'brand-glow-strong': '0 0 25px rgba(37, 99, 235, 0.45)',
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, rgba(56, 189, 248, 0.7) 0%, rgba(37, 99, 235, 0.95) 100%)',
      },
      borderColor: {
        subtle: '#1E293B',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1.5rem',
          sm: '2rem',
          lg: '3rem',
        },
      },
    },
  },
  plugins: [],
};
