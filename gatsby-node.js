const path = require('path');
const DirectoryNamedWebpackPlugin = require('directory-named-webpack-plugin');

exports.onCreateWebpackConfig = ({
  stage,
  getConfig,
  rules,
  loaders,
  actions,
}) => {
  const config = getConfig()
  if (stage.startsWith('develop') && config.resolve) {
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-dom': '@hot-loader/react-dom'
    }
  }
  
  actions.setWebpackConfig({
    resolve: {
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
      plugins: [new DirectoryNamedWebpackPlugin({
        exclude: /node_modules/
      })],
    },
  });
};

exports.createPages = async function({ actions, graphql }) {
  const { data } = await graphql(`
    query {
      people: allFile(filter: {sourceInstanceName: {eq: "people"}}) {
        edges {
          node {
            name
          }
        }
      }
    }
  `);
  
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query to create people.`)
    return
  }

  data.people.edges.forEach(edge => {
    const slug = edge.node.name;
    actions.createPage({
      path: slug,
      component: require.resolve(`./src/templates/person.js`),
      context: { 
        slug: slug 
      },
    });
  });
};