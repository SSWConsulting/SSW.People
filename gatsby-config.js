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
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'content',
        path: `${__dirname}/content`,
      },
    },
    'gatsby-plugin-postcss',
    'gatsby-plugin-image',
    'gatsby-plugin-sharp',
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: '@raae/gatsby-remark-oembed',
            options: {
              // usePrefix defaults to false
              // usePrefix: true is the same as ["oembed"]
              usePrefix: ['oembed', 'video'],
              providers: {
                // Important to exclude providers
                // that adds js to the page.
                // If you do not need them.
                exclude: ['Reddit'],
              },
            },
          },
          {
            resolve: 'gatsby-remark-figure-caption',
          },
          'gatsby-remark-relative-images', // must be before other image plugins
          {
            resolve: 'gatsby-remark-images',
            options: {
              // It's important to specify the maxWidth (in pixels) of
              // the content container as this plugin uses this as the
              // base for generating different widths of each image.
              maxWidth: 590,
              backgroundColor: 'transparent',
              linkImagesToOriginal: false,
              wrapperStyle: (fluidResult) =>
                [
                  `width:${fluidResult.presentationWidth}px`,
                  `height:${fluidResult.presentationHeight}px`,
                  `aspect-ratio:${fluidResult.aspectRatio}`,
                ].join(';'),
            },
          },
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
                  embedURL: (videoId) =>
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
    {
      resolve: 'gatsby-plugin-google-tagmanager',
      options: {
        id: process.env.GOOGLE_GTM_ID, // id: GTM-NXDBVV
        includeInDevelopment: true,
      },
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'SSW.People',
        short_name: 'SSW.People',
        start_url: '/',
        background_color: '#ffffff',
        theme_color: '#cc4141',
        display: 'standalone',
        icon: 'src/images/branding/icon.png',
        icons: [
          {
            src: 'src/images/branding/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'src/images/branding/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    },
  ];

  if (process.env.CHINA_BUILD && process.env.CHINA_BUILD === 'FALSE') {
    plugins.push({
      resolve: 'gatsby-plugin-google-gtag',
      options: {
        trackingIds: [
          process.env.GOOGLE_ANALYTICS, // Tracking Id: UA-111111111-1
        ],
        pluginConfig: {
          head: true,
        },
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
  plugins: [
    ...getPlugins(),
    'gatsby-plugin-client-side-redirect', // make sure to put last in the array
  ],
};
