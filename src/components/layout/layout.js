import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';
import Head from 'components/head';
import Header from 'components/header';
import Footer from 'components/footer';
import '../../style.css';
import Breadcrumbs from '../breadcrumb/breadcrumb';
import Menu from '../../../lib/ssw.megamenu/menu/menu';
import MobileMenu from '../../../lib/ssw.megamenu/mobile-menu/mobile-menu';
import GitHubIcon from '-!svg-react-loader!../../images/github.svg';
import InfoIcon from '-!svg-react-loader!../../images/info.svg';
import { profilesRepo } from '../../../site-config';

const profileChineseTag = '-Chinese';

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
          <div className="mx-2 md:mx-6 print-hidden">
            <Menu onClickToggle={() => actionOnToggleClick()}></Menu>
          </div>
          <div className="flex flex-row">
            <div className="w-3/4">
              {crumbs ? (
                <Breadcrumbs crumbs={crumbs} crumbLabel={crumbLabel} />
              ) : (
                <></>
              )}
            </div>
            <div className="w-1/4 mt-4 mx-2 md:mx-6 mb-3">
              <div className="float-right">
                {displayActions ? (
                  <div className="action-btn-container print-hidden">
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`${profilesRepo}/blob/main/${profileId.replace(
                        profileChineseTag,
                        ''
                      )}/${profileId}.md`}
                      className="action-btn-link"
                    >
                      <div className="action-btn-label">Edit</div>
                      <GitHubIcon
                        aria-label="logo"
                        className="action-btn-icon"
                      />
                    </a>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://rules.ssw.com.au/make-your-site-easy-to-maintain"
                      className="action-btn-link"
                    >
                      <div className="action-btn-label">Info</div>
                      <InfoIcon aria-label="logo" className="action-btn-icon" />
                    </a>
                  </div>
                ) : (
                  <div></div>
                )}
              </div>
            </div>
          </div>
          <main className="flex-1 sm:mx-auto lg:w-full">{children}</main>
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
