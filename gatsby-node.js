const axios = require('axios');
const crypto = require('crypto');
const path = require('path');
const DirectoryNamedWebpackPlugin = require('directory-named-webpack-plugin');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const makePluginData = require('./src/helpers/plugin-data');
const createRewriteMapsFile = require('./src/helpers/createRewriteMap');
const chinaHelper = require('./src/helpers/chinaHelper');
const { SkillSort } = require('./src/helpers/skillSort');
const { getViewDataFromCRM } = require('./src/helpers/CRMApi');

let assetsManifest = {};
const alumniPrefix = '/alumni';

exports.onCreateWebpackConfig = ({ stage, getConfig, actions }) => {
  const config = getConfig();
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
      aboutMeAudioUrl: user.aboutMeAudioUrl || '',
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
            qualifications
            quote
            quoteAuthor
            role
            category
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
          aboutMeAudioUrl
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
  const people = data.people.nodes.map(node => {
    const crmData = peopleCRM.find(x => x.id === node.frontmatter.id);
    const isCurrent =
      node.frontmatter.role === 'Sample Profile'
        ? true
        : crmData
        ? crmData.isActive
        : false;

    const nickname =
      node.frontmatter.role === 'Sample Profile'
        ? 'Sample'
        : crmData
        ? crmData.nickname
        : null;

    const prefix = isCurrent ? '' : alumniPrefix.replace('/', '') + '/';

    return {
      slug: node.parent.name,
      path: prefix + node.parent.name.toLowerCase(),
      nicknamePath: nickname
        ? prefix + nickname.replace(/ /g, '-').toLowerCase()
        : '',
      frontmatter: node.frontmatter,
      dataCRM: crmData,
      audio: crmData ? crmData.aboutMeAudioUrl : null,
      profileImage: peopleProfileImages.find(x => x.name === node.parent.name),
      sketchImage: peopleSketchImages.find(x => x.name === node.parent.name),
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
          audio: person.dataCRM ? person.dataCRM.aboutMeAudioUrl : null,
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
    .filter(page => page.path.startsWith(alumniPrefix))
    .map(page => {
      return {
        fromPath: pathPrefix + '/' + page.path.replace(alumniPrefix + '/', ''),
        toPath: pathPrefix + page.path,
      };
    });
  await createRewriteMapsFile(pluginData, rewrites.concat(alumniRewrites));
};
