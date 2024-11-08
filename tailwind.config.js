/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: '',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './shared/**/*.{js,ts,jsx,tsx}',
    './apps/**/*.{js,ts,jsx,tsx}',
    './node_modules/react-tailwindcss-datepicker/dist/index.esm.{js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#15191F',
        'secondary-gray': '#677283',
        'tertiary-gray': '#8A94A3',
        'primary-gray-border': '#E5E7EB',
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
        'primary-beige': '#e0bf9f',
      },
      fontFamily: { manrope: ['Manrope', 'sans-serif'] },
      width: {
        '1/10': '10%',
        sidenav: '5.5rem',
        portal: 'calc(100vw - 4.5rem)',
      },
      maxHeight: {
        modal: '70vh',
        recharge: '45vh',
      },
      minWidth: {
        md: '28rem',
        lg: '32rem',
      },
      gridTemplateRows: { 18: 'repeat(18, minmax(0, 1fr))' },
      screens: { '2xs': '375px', xs: '480px', mid: '856px', '3xl': '1575px' },
      zIndex: { 100: 100 },
      transitionDuration: { 1500: '1500ms' },
    },
  },
  plugins: [],
};
