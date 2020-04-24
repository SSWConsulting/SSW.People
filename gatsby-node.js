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
      location: user.defaultSite.name,
      billingRate: 0, //TODO: integrate with CRM data
      skills: {
        intermediateSkills: user.skills
          .filter(s => s.experienceLevel === 'Intermediate')
          .map(s => s.technology),
        advancedSkills: user.skills
          .filter(s => s.experienceLevel === 'Advanced')
          .map(s => s.technology),
      },
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
                nickname
                currentEmployee
              }
            }
          }
        }
      }
    }
  `);

  const people = data.people.edges.map(edge => {
    const isCurrent = edge.node.childMarkdownRemark
      ? edge.node.childMarkdownRemark.frontmatter.currentEmployee
      : false;
    const nickname = edge.node.childMarkdownRemark
      ? edge.node.childMarkdownRemark.frontmatter.nickname
      : null;
    const slug = edge.node.name;
    const prefix = '';
    return {
      slug: slug,
      path: prefix + slug.toLowerCase(),
      nicknamePath: nickname
        ? prefix + nickname.replace(/ /g, '-').toLowerCase()
        : '',
      audio: slug + '-Audio',
      profileImage: slug + '-Profile',
      sketchImage: slug + '-Sketch',
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
