const siteConfig = require('./site-config');

require('dotenv').config({
	path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
	pathPrefix: `/people`,
	siteMetadata: {
		...siteConfig,
	},
	plugins: [
		'gatsby-plugin-react-helmet',
		'gatsby-plugin-sitemap',
		'gatsby-transformer-json',
		{
			resolve: 'gatsby-source-git',
			options: {
				name: 'people',
				remote: 'https://github.com/SSWConsulting/People.git',
				// Optionally supply a branch. If none supplied, you'll get the default branch.
				branch: 'master',
				// Tailor which files get imported eg. import the docs folder from a codebase.
				patterns: '*-*/**',
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
						resolve: 'gatsby-remark-images',
						options: {
							// It's important to specify the maxWidth (in pixels) of
							// the content container as this plugin uses this as the
							// base for generating different widths of each image.
							maxWidth: 590,
							backgroundColor: 'transparent',
						},
					},
					'gatsby-remark-relative-images',
          'gatsby-remark-copy-linked-files',
          {
            resolve: "gatsby-remark-custom-blocks",
            options: {
              blocks: {
                imgBadge: {
                  classes: "img-badge",
                },
                imgLg: {
                  classes: "img-large",
                },
                imgMd: {
                  classes: "img-medium",
                },
                imgSm: {
                  classes: "img-small",
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
                  embedURL: videoId => `https://www.youtube-nocookie.com/embed/${videoId}`,
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
        autoGenHomeLabel: "People",
        useClassNames: true
      }
    },
	],
};
