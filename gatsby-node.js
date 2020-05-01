const axios = require('axios');
const crypto = require('crypto');
const path = require('path');
const DirectoryNamedWebpackPlugin = require('directory-named-webpack-plugin');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const makePluginData = require('./src/helpers/plugin-data');
const createRewriteMapsFile = require('./src/helpers/createRewriteMap');

let assetsManifest = {};

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

  const crmDataResult = await axios({
    method: 'get',
    url: process.env.SOPHIE_API_URL,
    data: {},
    headers: {
      Authorization: process.env.SOPHIE_AUTHORIZATION,
      Tenant: process.env.SOPHIE_TENANT,
    },
  });

  crmDataResult.data.map(user => {
    const userNode = {
      id: user.userId,
      parent: '__SOURCE__',
      internal: {
        type: 'CrmDataCollection',
      },
      children: [],

      slug: `${user.firstName}-${user.lastName}`,
      fullName: `${user.firstName} ${user.lastName}`,
      emailAddress: user.emailAddress,
      location: user.defaultSite ? user.defaultSite.name : 'Others',
      billingRate: user.billableRate,
      skills: {
        intermediateSkills: user.skills
          .filter(s => s.experienceLevel === 'Intermediate')
          .map(s => s.technology),
        advancedSkills: user.skills
          .filter(s => s.experienceLevel === 'Advanced')
          .map(s => s.technology),
      },
      isActive: user.isActive,
      nickname: user.nickname || '',
      blogUrl: user.blogUrl,
      facebookUrl: user.facebookUrl,
      skypeUsername: user.skypeUsername,
      linkedInUrl: user.linkedInUrl,
      twitterUsername: user.twitterUsername,
      gitHubUrl: user.gitHubUrl,
      youTubePlayListId: user.youTubePlayListId,
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
      people: allFile(
        filter: {
          extension: { eq: "md" }
          sourceInstanceName: { eq: "people" }
        }
      ) {
        edges {
          node {
            name
            childMarkdownRemark {
              frontmatter {
                id
              }
            }
          }
        }
      }
      peopleCRM: allCrmDataCollection {
        edges {
          node {
            id
            isActive
            nickname
          }
        }
      }
    }
  `);

  const peopleCRM = data.peopleCRM.edges.map(edge => {
    return {
      id: edge.node.id,
      isActive: edge.node.isActive,
      nickname: edge.node.nickname || null,
    };
  });

  const people = data.people.edges.map(edge => {
    const crmData = peopleCRM.find(
      x => x.id === edge.node.childMarkdownRemark.frontmatter.id
    );

    const isCurrent = crmData ? crmData.isActive : false;
    const nickname = crmData ? crmData.nickname : null;
    const prefix = isCurrent ? '' : 'previous-employees/';
    const id = crmData
      ? crmData.id
      : edge.node.childMarkdownRemark.frontmatter.id;
    return {
      id: id,
      slug: edge.node.name,
      path: prefix + edge.node.name.toLowerCase(),
      nicknamePath: nickname
        ? prefix + nickname.replace(/ /g, '-').toLowerCase()
        : '',
      audio: edge.node.name + '-Audio',
      profileImage: edge.node.name + '-Profile',
      sketchImage: edge.node.name + '-Sketch',
    };
  });

  people.forEach(person => {
    actions.createPage({
      path: person.nicknamePath ? person.nicknamePath : person.path,
      component: require.resolve('./src/templates/person.js'),
      context: {
        id: person.id,
        slug: person.slug,
        originalPath: person.path,
        nicknamePath: person.nicknamePath,
        audio: person.audio,
        profileImage: person.profileImage,
        sketchImage: person.sketchImage,
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
      return {
        fromPath: pathPrefix + '/' + page.context.originalPath,
        toPath: pathPrefix + page.path,
      };
    });
  await createRewriteMapsFile(pluginData, rewrites);
};
