import React from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';
import Head from 'components/head';
import Header from 'components/header';
import '../../style.css';

const Layout = ({ data, children }) => (
	<div className="flex flex-col min-h-screen">
		<Head />
		<Header title={data.site.siteMetadata.siteTitle} />
		<main className="flex-1">
			{children}
		</main>
	</div>
);

Layout.propTypes = {
	children: PropTypes.node.isRequired,
	data: PropTypes.object.isRequired,
};

const LayoutWithQuery = props => (
	<StaticQuery
		query={graphql`
			query LayoutQuery {
				site {
					siteMetadata {
						siteTitle
					}
				}
			}
		`}
		render={data => <Layout data={data} {...props} />}
	/>
);

LayoutWithQuery.propTypes = {
	children: PropTypes.node.isRequired,
};

export default LayoutWithQuery;
