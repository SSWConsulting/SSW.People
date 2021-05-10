const axios = require('axios');
const crypto = require('crypto');
const path = require('path');
const DirectoryNamedWebpackPlugin = require('directory-named-webpack-plugin');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const makePluginData = require('./src/helpers/plugin-data');
const createRewriteMap = require('./src/helpers/createRewriteMap');
const chinaHelper = require('./src/helpers/chinaHelper');
const { SkillSort } = require('./src/helpers/skillSort');
const { getViewDataFromCRM } = require('./src/helpers/CRMApi');
const appInsights = require('applicationinsights');
const fs = require('fs');
const siteconfig = require('./site-config');

if (process.env.APPINSIGHTS_INSTRUMENTATIONKEY) {
  // Log build time stats to appInsights
  appInsights
    .setup()
    .setAutoCollectConsole(true, true) // Enable logging of console.xxx
    .start();
} else {
  // eslint-disable-next-line no-console
  console.warn(
    'Missing APPINSIGHTS_INSTRUMENTATIONKEY, this build will not be logged to Application Insights'
  );
}

let assetsManifest = {};
const alumniPrefix = siteconfig.alumniPrefix;
const profileChineseTag = '-Chinese';

exports.onCreateWebpackConfig = ({ stage, loaders, getConfig, actions }) => {
  const config = getConfig();
  //Fix thrid party module needing window as per https://www.gatsbyjs.com/docs/debugging-html-builds/#fixing-third-party-modules
  if (stage === 'build-html') {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /react-lazy-youtube/,
            use: loaders.null(),
          },
        ],
      },
    });
  }

  if (stage.startsWith('develop') && config.resolve) {
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-dom': '@hot-loader/react-dom',
    };
  }

  actions.setWebpackConfig({
    plugins: [
      new WebpackAssetsManifest({
        assets: assetsManifest, // mutates object with entries
        merge: true,
      }),
    ],
    resolve: {
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
      plugins: [
        new DirectoryNamedWebpackPlugin({
          exclude: /node_modules/,
        }),
      ],
    },
  });
};

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = `
    type SitePage implements Node @dontInfer {
      path: String!
    }
    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
    }
    type Frontmatter {
      id: String
      name: String
      qualifications: String
      quote: String
      quoteAuthor: String
      role: String
      jobTitle: String
      alternativeUrl: String
    }
  `;
  createTypes(typeDefs);
};

const loadSampleData = crmData => {
  try {
    let rawdata = fs.readFileSync('SampleProfileCRMData.json');
    let sampleData = JSON.parse(rawdata);
    sampleData.forEach(user => {
      if (user.userId) {
        crmData.push(user);
      }
    });
  } catch (err) {
    // if error, then we don't add anything
  }
};

exports.sourceNodes = async ({ actions }) => {
  const { createNode } = actions;
  let crmDataResult;

  // if DATA_API_URL == FALSE then we load data from CRM
  if (process.env.DATA_API_URL !== 'FALSE') {
    var headers =
      process.env.DATA_API_AUTHORIZATION === 'FALSE'
        ? {}
        : {
            Authorization: process.env.DATA_API_AUTHORIZATION,
          };

    crmDataResult = await axios({
      method: 'get',
      url: process.env.DATA_API_URL,
      data: {},
      headers: headers,
    });
    crmDataResult = crmDataResult.data;
  } else {
    crmDataResult = await getViewDataFromCRM();
  }

  // load data for the sample profile
  loadSampleData(crmDataResult);

  crmDataResult.map(user => {
    const userNode = {
      id: user.userId,
      parent: '__SOURCE__',
      internal: {
        type: 'CrmDataCollection',
      },
      children: [],

      slug: user.fullName
        ? user.fullName.replace(' ', '-')
        : `${user.firstName}-${user.lastName}`,
      fullName: user.fullName
        ? user.fullName
        : `${user.firstName} ${user.lastName}`,
      emailAddress: user.emailAddress || '',
      location: user.defaultSite ? user.defaultSite : 'Others',
      jobTitle: user.jobTitle.replace(/(SSW)(?! TV)/g, '') || '',
      role: user.role || '',
      billingRate: user.billableRate || '',
      skills: {
        intermediateSkills: user.skills
          .filter(s => s.experienceLevel === 'Intermediate')
          .sort(SkillSort)
          .map(s => s.technology),
        advancedSkills: user.skills
          .filter(s => s.experienceLevel === 'Advanced')
          .sort(SkillSort)
          .map(s => s.technology),
      },
      isActive: user.isActive,
      nickname: user.nickname || '',
      blogUrl: user.blogUrl || '',
      facebookUrl: user.facebookUrl || '',
      skypeUsername: user.skypeUsername || '',
      linkedInUrl: user.linkedInUrl || '',
      twitterUsername: user.twitterUsername || '',
      gitHubUrl: user.gitHubUrl || '',
      youTubePlayListId: user.youTubePlayListId || '',
      publicPhotoAlbumUrl: user.publicPhotoAlbumUrl || '',
    };

    // Get content digest of node. (Required field)
    const contentDigest = crypto
      .createHash('md5')
      .update(JSON.stringify(userNode))
      .digest('hex');
    // add it to userNode
    userNode.internal.contentDigest = contentDigest;

    // Create node with the gatsby createNode() API
    createNode(userNode);
  });

  return;
};

exports.createPages = async function({ actions, graphql }) {
  const { data } = await graphql(`
    query {
      people: allMarkdownRemark {
        nodes {
          parent {
            ... on File {
              name
            }
          }
          frontmatter {
            id
            name
            qualifications
            quote
            quoteAuthor
            role
            jobTitle
          }
          html
        }
      }
      peopleCRM: allCrmDataCollection {
        nodes {
          id
          isActive
          nickname
          skills {
            advancedSkills
            intermediateSkills
          }
          location
          jobTitle
          role
          emailAddress
          skypeUsername
          twitterUsername
          gitHubUrl
          youTubePlayListId
          blogUrl
          facebookUrl
          linkedInUrl
          fullName
          publicPhotoAlbumUrl
        }
      }
      peopleAudios: allFile(
        filter: {
          sourceInstanceName: { eq: "people" }
          name: { glob: "*-Audio" }
        }
      ) {
        nodes {
          name
          publicURL
        }
      }
      peopleProfileImages: allFile(
        filter: {
          sourceInstanceName: { eq: "people" }
          name: { glob: "*-Profile" }
        }
      ) {
        nodes {
          childImageSharp {
            original {
              src
            }
            parent {
              ... on File {
                name
              }
            }
          }
        }
      }
      peopleSketchImages: allFile(
        filter: {
          sourceInstanceName: { eq: "people" }
          name: { glob: "*-Sketch" }
        }
      ) {
        nodes {
          childImageSharp {
            original {
              src
            }
            parent {
              ... on File {
                name
              }
            }
          }
        }
      }
    }
  `);

  const peopleCRM = data.peopleCRM.nodes.map(node => {
    return node;
  });

  const peopleAudios = data.peopleAudios.nodes.map(node => {
    return {
      src: node.publicURL,
      name: node.name.replace('-Audio', ''),
    };
  });
  const peopleProfileImages = data.peopleProfileImages.nodes.map(node => {
    return {
      src: node.childImageSharp.original.src,
      name: node.childImageSharp.parent.name.replace('-Profile', ''),
    };
  });
  const peopleSketchImages = data.peopleSketchImages.nodes.map(node => {
    return {
      src: node.childImageSharp.original.src,
      name: node.childImageSharp.parent.name.replace('-Sketch', ''),
    };
  });
  const people = data.people.nodes
    .filter(
      node =>
        node.frontmatter.id &&
        (peopleCRM.find(x => x.id === node.frontmatter.id) ||
          node.frontmatter.id.indexOf('-') < 0)
    )
    .map(node => {
      const crmData = peopleCRM.find(x => x.id === node.frontmatter.id);
      const isCurrent = crmData ? crmData.isActive : false;

      const nickname = crmData ? crmData.nickname : null;

      const prefix = isCurrent ? '' : alumniPrefix.replace('/', '') + '/';

      return {
        slug: node.parent.name,
        path: prefix + node.parent.name.toLowerCase(),
        nicknamePath: nickname
          ? prefix + nickname.replace(/ /g, '-').toLowerCase()
          : '',
        frontmatter: node.frontmatter,
        dataCRM: crmData,
        audio: peopleAudios.find(
          x => x.name === node.parent.name.replace(profileChineseTag, '')
        ),
        profileImage: peopleProfileImages.find(
          x => x.name === node.parent.name.replace(profileChineseTag, '')
        ),
        sketchImage: peopleSketchImages.find(
          x => x.name === node.parent.name.replace(profileChineseTag, '')
        ),
        html: node.html,
      };
    });

  people.forEach(person => {
    actions.createPage({
      path: person.nicknamePath ? person.nicknamePath : person.path,
      component: require.resolve('./src/templates/person.js'),
      context: {
        slug: person.slug,
        originalPath: person.path,
        nicknamePath: person.nicknamePath,
        data: {
          audio: person.audio,
          profileImage: person.profileImage,
          sketchImage: person.sketchImage,
          frontmatter: person.frontmatter,
          dataCRM: person.dataCRM,
          html: chinaHelper.isChinaBuild
            ? chinaHelper.cleanHtml(person.html)
            : person.html,
        },
      },
    });
  });
};

exports.onPostBuild = async ({ store, pathPrefix }) => {
  const { pages } = store.getState();
  const pluginData = makePluginData(store, assetsManifest, pathPrefix);
  const rewrites = Array.from(pages.values())
    .filter(
      page =>
        page.context.nicknamePath &&
        page.context.originalPath !== page.context.nicknamePath
    )
    .map(page => {
      if (page.path.startsWith(alumniPrefix)) {
        return {
          fromPath:
            pathPrefix +
            '/' +
            page.context.originalPath.replace(
              alumniPrefix.substring(1) + '/',
              ''
            ),
          toPath: pathPrefix + page.path,
        };
      } else {
        return {
          fromPath: pathPrefix + '/' + page.context.originalPath,
          toPath: pathPrefix + page.path,
        };
      }
    });

  const alumniRewrites = Array.from(pages.values())
    .filter(
      page =>
        page.path !== alumniPrefix + '/' && page.path.startsWith(alumniPrefix)
    )
    .map(page => {
      return {
        fromPath: pathPrefix + '/' + page.path.replace(alumniPrefix + '/', ''),
        toPath: pathPrefix + page.path,
      };
    });

  //Fetch existing URL redirects for previous Nicknames
  const existingRewrites = await createRewriteMap.getExistingRewrites();
  const additionalRewrites = Array.from(existingRewrites).map(rewrite => {
    let existingRedirect = rewrites.find(
      r => r.fromPath === pathPrefix + '/' + rewrite.fullName
    );
    if (existingRedirect) {
      return {
        fromPath: pathPrefix + '/' + rewrite.nickName,
        toPath: existingRedirect.toPath,
      };
    } else {
      return {
        fromPath: pathPrefix + '/' + rewrite.nickName,
        toPath: pathPrefix + '/' + rewrite.fullName,
      };
    }
  });

  const allRewrites = rewrites
    .concat(alumniRewrites)
    .concat(additionalRewrites);

  const allRewritesUnique = [
    ...new Map(allRewrites.map(item => [item.fromPath, item])).values(),
  ];
  await createRewriteMap.writeRewriteMapsFile(pluginData, allRewritesUnique);
};
