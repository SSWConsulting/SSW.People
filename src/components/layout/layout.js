import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';
import Head from 'components/head';
import Header from 'components/header';
import Footer from 'components/footer';
import '../../style.css';
import Breadcrumbs from '../breadcrumb/breadcrumb';
import GoogleAnalytics from '../google-analytics/google-analytics';
import Menu from '../../../lib/ssw.megamenu/menu/menu';
import MobileMenu from '../../../lib/ssw.megamenu/mobile-menu/mobile-menu';
import { isChinaBuild } from '../../helpers/chinaHelper';

const Layout = ({
  children,
  displayActions,
  profileId,
  pageTitle,
  crumbs,
  crumbLabel,
}) => {
  const node = useRef();
  const [isMenuOpened, setIsMenuOpened] = useState(false);

  const actionOnToggleClick = () => {
    setIsMenuOpened(!isMenuOpened);
  };

  const handleClick = e => {
    if (node.current.contains(e.target)) {
      setIsMenuOpened(false);
    }
  };

  return (
    <div className={isMenuOpened ? 'overflow-hidden' : 'overflow-auto'}>
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        ref={node}
        onMouseDown={isMenuOpened ? event => handleClick(event) : null}
        className={isMenuOpened ? 'translateX84' : 'translateX0'}
      >
        <div className="flex flex-col min-h-screen main-container">
          <Head pageTitle={pageTitle} />
          <Header displayActions={displayActions} profileId={profileId} />
          {!isChinaBuild && (
            <GoogleAnalytics pageTitle={pageTitle}></GoogleAnalytics>
          )}
          <div className="mx-6">
            <Menu onClickToggle={() => actionOnToggleClick()}></Menu>
          </div>
          {crumbs ? (
            <Breadcrumbs crumbs={crumbs} crumbLabel={crumbLabel} />
          ) : (
            <div></div>
          )}
          <main className="flex-1 mx-auto">{children}</main>
        </div>
        <Footer />
      </div>
      <MobileMenu isMenuOpened={isMenuOpened}></MobileMenu>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  data: PropTypes.object.isRequired,
  displayActions: PropTypes.bool.isRequired,
  profileId: PropTypes.string,
  pageTitle: PropTypes.string,
  crumbs: PropTypes.array,
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
