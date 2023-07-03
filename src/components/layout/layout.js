import React from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';
import Head from 'components/head';
import Header from 'components/header';
import Footer from 'components/footer';
import '../../style.css';
import Breadcrumbs from '../breadcrumb/breadcrumb';
import { MenuBar } from 'ssw.megamenu';
import 'ssw.megamenu/dist/style.css';

const Layout = ({ children, pageTitle, crumbs, crumbLabel }) => {
  return (
    <div>
      <div className="flex flex-col min-h-screen main-container">
        <Head pageTitle={pageTitle} />
        <Header />
        <div className="mx-2 md:mx-6 print-hidden">
          <MenuBar />
        </div>
        <div className="flex flex-row">
          <div className="w-3/4">
            {crumbs ? (
              <Breadcrumbs crumbs={crumbs} crumbLabel={crumbLabel} />
            ) : (
              <></>
            )}
          </div>
        </div>
        <main className="flex-1 sm:mx-auto lg:w-full">{children}</main>
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
