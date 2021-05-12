/*eslint quotes: ["warn", "backtick"]*/
const path = require(`path`);

module.exports = {
  companyName: `SSW Consulting`,
  companyShortName: `SSW`,
  siteTitle: `SSW.People | Australia's Leading .NET and Azure Consultants`,
  siteTitleShort: `SSW.People | Australia's Leading .NET and Azure Consultants`,
  siteDescription:
    `We work together to form an amazing collective brain - SSW is made up of a great team of staff that are passionate about technology and how it meets business needs!` +
    `We're enthusiastic and have a "Make it happen" culture.`,
  siteUrl: `https://ssw.com.au`,
  siteUrlCn: `https://peoplecn.ssw.com.au`,
  themeColor: `#cc4141`,
  backgroundColor: `#fff`,
  pathPrefix: `/people`,
  alumniPrefix: `/alumni`,
  logo: path.resolve(__dirname, `src/images/branding/icon.png`),
  social: {
    twitter: `SSW_TV`,
    fbAppId: `120920301257947`,
    fbPage: `https://www.facebook.com/SSW.page`,
  },
  parentSiteUrl: `https://ssw.com.au`,
  locationsListForOrdering: [`Sydney`, `Melbourne`, `Brisbane`, `Newcastle`],
  roleListOrdering: [
    `Managers`,
    `Developers`,
    `Designers`,
    `Marketing & Video`,
    `Automation & Electrical`,
    `Admins`,
    `Others`,
  ],
  profilesRepo: `https://github.com/SSWConsulting/SSW.People.Profiles`,
};
