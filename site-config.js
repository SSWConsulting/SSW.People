/*eslint quotes: ["warn", "backtick"]*/
const path = require(`path`);

module.exports = {
  companyName: `Northwind Sample`,
  companyShortName: `Northwind`,
  siteTitle: `Northwind | Do what you love Create the future you want`,
  siteTitleShort: `Northwind | Do what you love Create the future you want`,
  siteDescription:
    `We work together to form an amazing collective brain - Northwind is made up of a great team of staff that are passionate about technology and how it meets business needs!` +
    `We're enthusiastic and have a "Make it happen" culture.`,
  siteUrl: `https://www.northwind-sample.com.au`,
  themeColor: `#cc4141`,
  backgroundColor: `#fff`,
  pathPrefix: null,
  logo: path.resolve(__dirname, `src/images/branding/icon.png`),
  social: {
    twitter: `microsoft`,
    fbAppId: `120920301257947`,
    fbPage: `https://www.facebook.com/Northwind-sample`,
  },
  parentSiteUrl: `https://www.northwind-sample.com.au`,
};
