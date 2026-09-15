/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F5E6E1',
          100: '#F3E0D9',
          500: '#7A1F32',
          600: '#681A2B',
          700: '#541525'
        },
        slate: {
          50: '#F8F1E7',
          100: '#F2EAE0',
          200: '#E8E1D8',
          300: '#D8CEC3',
          400: '#C8B7A8',
          500: '#756D67',
          600: '#5E5752',
          700: '#292421',
          800: '#1F1B19',
          900: '#171311'
        },
        sage: {
          50: '#F3F5F0',
          100: '#E4E9DF',
          500: '#66755A',
          600: '#53614B'
        },
        gold: {
          50: '#FBF5EC',
          100: '#F4E5CA',
          500: '#C89B5B',
          600: '#B27E38'
        },
        emerald: {
          50: '#E7F1E8',
          100: '#D8E9DA',
          500: '#3F7D4A',
          600: '#2F663A'
        },
        amber: {
          50: '#FFF3D6',
          100: '#FDE7B0',
          500: '#B7791F',
          600: '#9D6616'
        },
        blue: {
          50: '#E4EDF4',
          100: '#D3E0EE',
          500: '#426B8C',
          600: '#345B7C'
        },
        red: {
          50: '#F8E4E4',
          100: '#F2D0D0',
          500: '#A33A3A',
          600: '#8A2E2E'
        }
      },
      boxShadow: {
        soft: '0 14px 36px rgba(122, 31, 50, 0.08)'
      }
    }
  },
  plugins: []
};
