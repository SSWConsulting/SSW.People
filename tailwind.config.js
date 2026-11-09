module.exports = {
  content: ['./src/**/*.{js,jsx}', './node_modules/ssw.megamenu/**/*.js'],
  theme: {
    extend: {
      colors: {
        ssw: {
          red: 'var(--primary)',
        },
        'tooltip-grey': '#9e9e9e',
        'ssw-red': 'var(--primary)',
        strong: 'var(--text-strong)',
        weak: 'var(--text-weak)',
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
