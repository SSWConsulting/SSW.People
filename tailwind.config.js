module.exports = {
  content: ['./src/**/*.js', 'node_modules/ssw.megamenu/**/*.js'],
  theme: {
    extend: {
      screens: {
        print: { raw: 'print' },
      },
      colors: {
        ssw: {
          red: '#cc4141',
        },
        'tooltip-grey': '#9e9e9e',
        'ssw-red': '#cc4141',
        'ssw-grey': '#eee',
        'light-grey': '#ccc',
        'ssw-black': '#333',
        'real-black': '#000',
      },
    },
  },
  variants: {},
  plugins: [],
};
