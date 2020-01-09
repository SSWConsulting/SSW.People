import React from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';
import Head from 'components/head';
import Header from 'components/header';
import Footer from 'components/footer';
import '../../style.css';

const Layout = ({ data, children, displayActions, profileId }) => (
  <div className="flex flex-col min-h-screen lg:mx-24 xl:mx-24">
    <Head />
    <Header title={data.site.siteMetadata.siteTitle} displayActions={displayActions}
      profileId={profileId} />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  data: PropTypes.object.isRequired,
  displayActions: PropTypes.bool.isRequired,
  profileId: PropTypes.string
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
