/*eslint quotes: ["warn", "backtick"]*/
const path = require(`path`);

module.exports = {
  companyName: `Microsoft`,
  companyShortName: `Microsoft`,
  siteTitle: `Microsoft | Do what you love Create the future you want`,
  siteTitleShort: `Microsoft | Do what you love Create the future you want`,
  siteDescription:
    `We work together to form an amazing collective brain - SSW is made up of a great team of staff that are passionate about technology and how it meets business needs!` +
    `We're enthusiastic and have a "Make it happen" culture.`,
  siteUrl: `https://microsoft.ssw.com.au`,
  themeColor: `#cc4141`,
  backgroundColor: `#fff`,
  pathPrefix: null,
  logo: path.resolve(__dirname, `src/images/branding/icon.png`),
  social: {
    twitter: `microsoft`,
    fbAppId: `120920301257947`,
    fbPage: `https://www.facebook.com/Microsoft`,
  },
  parentSiteUrl: `https://www.microsoft.com.au`,
};
