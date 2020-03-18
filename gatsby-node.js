const axios = require('axios');
const crypto = require('crypto');
const path = require('path');
const DirectoryNamedWebpackPlugin = require('directory-named-webpack-plugin');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const makePluginData = require('./src/helpers/plugin-data');
const createRewriteMapsFile = require('./src/helpers/createRewriteMap');

let assetsManifest = {};

exports.onCreateWebpackConfig = ({
  stage,
  getConfig,
  rules,
  loaders,
  actions,
}) => {
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

  crmDataResult.data.map((user, i) => {
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
      people: allFile(filter: { sourceInstanceName: { eq: "people" } }) {
        edges {
          node {
            name
            childMarkdownRemark {
              frontmatter {
                customUrl
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
    const customUrl = edge.node.childMarkdownRemark
      ? edge.node.childMarkdownRemark.frontmatter.customUrl
      : null;
    const slug = edge.node.name;
    const prefix = isCurrent ? '' : 'previous-employees/';
    return {
      slug: slug,
      squareImage: slug + '-Profile-Square',
      path: prefix + slug.toLowerCase(),
      customPath: customUrl ? prefix + customUrl.toLowerCase() : '',
    };
  });

  people.forEach(person => {
    actions.createPage({
      path: person.path,
      component: require.resolve('./src/templates/person.js'),
      context: {
        slug: person.slug,
        squareImage: person.squareImage,
        customPath: person.customPath,
      },
    });
  });
};

exports.onPostBuild = async ({ store, pathPrefix }) => {
  const { pages } = store.getState();
  const pluginData = makePluginData(store, assetsManifest, pathPrefix);
  const rewrites = Array.from(pages.values())
    .filter(
      page => page.context.customPath && page.context.customPath !== page.path
    )
    .map(page => {
      return {
        fromPath: pathPrefix + '/' + page.context.customPath,
        toPath: pathPrefix + page.path,
      };
    });
  await createRewriteMapsFile(pluginData, rewrites);
};
