const axios = require('axios');
const crypto = require('crypto');
const path = require('path');
const DirectoryNamedWebpackPlugin = require('directory-named-webpack-plugin');

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
					}
				}
			}
		}
	`);

	data.people.edges.forEach(edge => {
		const slug = edge.node.name;
		const squareImage = slug + '-Profile-Square';
		actions.createPage({
			path: slug.toLowerCase(),
			component: require.resolve('./src/templates/person.js'),
			context: {
				slug: slug,
				squareImage: squareImage,
			},
		});
	});
};
