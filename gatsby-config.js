const siteConfig = require('./site-config');

require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

const getPlugins = () => {
  let plugins = [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sitemap',
    'gatsby-transformer-json',
    {
      resolve: 'gatsby-source-git',
      options: {
        name: 'people',
        remote: `${siteConfig.profilesRepo}.git`,
        // Optionally supply a branch. If none supplied, you'll get the default branch.
        branch: 'main',
        // Tailor which files get imported eg. import the docs folder from a codebase.
        patterns: '*-*/**',
      },
    },
    {
      resolve: 'gatsby-source-git',
      options: {
        name: 'people',
        remote: `${siteConfig.profilesRepo}.git`,
        // Optionally supply a branch. If none supplied, you'll get the default branch.
        branch: 'main',
        // Tailor which files get imported eg. import the docs folder from a codebase.
        patterns: 'badges/**',
      },
    },
    'gatsby-plugin-eslint',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'content',
        path: `${__dirname}/content`,
      },
    },
    'gatsby-plugin-postcss',
    'gatsby-plugin-sharp',
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-figure-caption',
          },
          {
            resolve: 'gatsby-remark-images',
            options: {
              // It's important to specify the maxWidth (in pixels) of
              // the content container as this plugin uses this as the
              // base for generating different widths of each image.
              maxWidth: 590,
              backgroundColor: 'transparent',
              linkImagesToOriginal: false,
            },
          },
          'gatsby-remark-relative-images',
          'gatsby-remark-copy-linked-files',
          {
            resolve: 'gatsby-remark-custom-blocks',
            options: {
              blocks: {
                imgBadge: {
                  classes: 'img-badge',
                },
                imgBanner: {
                  classes: 'img-banner',
                },
                imgLg: {
                  classes: 'img-large',
                },
                imgMd: {
                  classes: 'img-medium',
                },
                imgSm: {
                  classes: 'img-small',
                },
                imgLogo: {
                  classes: 'img-logo',
                },
              },
            },
          },
          {
            resolve: 'gatsby-remark-embed-video',
            options: {
              maxWidth: 800,
              ratio: 1.77, // Optional: Defaults to 16/9 = 1.77
              height: 400, // Optional: Overrides optional.ratio
              related: false, //Optional: Will remove related videos from the end of an embedded YouTube video.
              noIframeBorder: true, //Optional: Disable insertion of <style> border: 0
              urlOverrides: [
                {
                  id: 'youtube',
                  embedURL: videoId =>
                    `https://www.youtube-nocookie.com/embed/${videoId}`,
                },
              ], //Optional: Override URL of a service provider, e.g to enable youtube-nocookie support
            },
          },
          'gatsby-remark-responsive-iframe',
        ],
      },
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-webpack-size',
    {
      resolve: 'gatsby-plugin-react-svg',
      options: {
        rule: {
          include: /images\/.*\.svg$/,
        },
      },
    },
    {
      resolve: 'gatsby-plugin-breadcrumb',
      options: {
        useAutoGen: true,
        autoGenHomeLabel: 'People',
        useClassNames: true,
      },
    },
  ];

  if (process.env.CHINA_BUILD && process.env.CHINA_BUILD === 'FALSE') {
    plugins.push({
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        // replace "UA-XXXXXXXXX-X" with your own Tracking ID
        trackingId: process.env.GOOGLE_ANALYTICS,
      },
    });
  }
  return plugins;
};

module.exports = {
  flags: { PRESERVE_WEBPACK_CACHE: true },
  pathPrefix: `${siteConfig.pathPrefix}${
    process.env.CHINA_BUILD && process.env.CHINA_BUILD === 'TRUE' ? '-cn' : ''
  }`,
  siteMetadata: {
    ...siteConfig,
  },
  plugins: getPlugins(),
};
