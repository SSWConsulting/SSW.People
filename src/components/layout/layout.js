import React from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';
import Head from 'components/head';
import Header from 'components/header';
import Footer from 'components/footer';
import '../../style.css';
import Breadcrumbs from '../breadcrumb/breadcrumb';
import { Toaster } from 'react-hot-toast';

const Layout = ({ children, pageTitle, crumbs, crumbLabel, wideGutter }) => {
  // On phones, the list pages line their content up with the header (32px).
  const gutter = wideGutter ? ' px-4 sm:px-0' : '';

  return (
    <div>
      <div className="flex flex-col min-h-screen w-fit main-container mt-4 sm:mt-0">
        <Toaster position="top-center" reverseOrder={false} />
        <Head pageTitle={pageTitle} />
        <Header />
        <div className={`flex flex-row${gutter}`}>
          {crumbs ? (
            <Breadcrumbs crumbs={crumbs} crumbLabel={crumbLabel} />
          ) : (
            <></>
          )}
        </div>
        <main className={`flex-1 mx-auto lg:w-full${gutter}`}>{children}</main>
      </div>
      <Footer />
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  data: PropTypes.object.isRequired,
  profileId: PropTypes.string,
  pageTitle: PropTypes.string,
  crumbs: PropTypes.array,
  crumbLabel: PropTypes.string,
  wideGutter: PropTypes.bool,
};

const LayoutWithQuery = (props) => (
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
    render={(data) => <Layout data={data} {...props} />}
  />
);

LayoutWithQuery.propTypes = {
  children: PropTypes.node.isRequired,
};

export default LayoutWithQuery;
