/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './shared/**/*.{js,ts,jsx,tsx}',
    './apps/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#15191F',
        'secondary-gray': '#677283',
        'tertiary-gray': '#8A94A3',
        'primary-border-gray': '#E5E7EB',
        'primary-blue': '#0066ff',
        'primary-blue-hover': '#094DB3',
        'secondary-blue': '#ECF3FE',
        disabled: '#ACB5C3',
        success: '#257436',
        'background-success': '#D9F2DF',
        error: '#A72525',
        'background-error': '#F6D5D5',
        'icon-error': '#7D1C1C',
        warning: '#907309',
        'background-warning': '#EBE3AD',
      },
      fontFamily: { manrope: ['Manrope', 'sans-serif'] },
      width: { '1/10': '10%' },
      gridTemplateRows: { 18: 'repeat(18, minmax(0, 1fr))' },
      screens: { xs: '480px', mid: '856px' },
    },
  },
  plugins: [],
};
