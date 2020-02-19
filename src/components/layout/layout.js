import React from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';
import Head from 'components/head';
import Header from 'components/header';
import Footer from 'components/footer';
import '../../style.css';
import Breadcrumbs from '../breadcrumb/breadcrumb';
import GoogleAnalytics from '../google-analytics/google-analytics';

const Layout = ({
  data,
  children,
  displayActions,
  profileId,
  pageTitle,
  crumbs,
  crumbLabel,
}) => (
  <>
    <div className="flex flex-col min-h-screen main-container">
      <Head pageTitle={pageTitle} />
      <Header
        title={data.site.siteMetadata.siteTitle}
        displayActions={displayActions}
        profileId={profileId}
      />
      <GoogleAnalytics pageTitle={pageTitle}></GoogleAnalytics>
      {crumbs ? (
        <Breadcrumbs crumbs={crumbs} crumbLabel={crumbLabel} />
      ) : (
        <div></div>
      )}
      <main className="flex-1 mx-auto">{children}</main>
    </div>
    <Footer />
  </>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  data: PropTypes.object.isRequired,
  displayActions: PropTypes.bool.isRequired,
  profileId: PropTypes.string,
  pageTitle: PropTypes.string,
  crumbs: PropTypes.any,
  crumbLabel: PropTypes.string,
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
