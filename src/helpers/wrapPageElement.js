import React from 'react';
import Transition from 'components/transition';
import PropTypes from 'prop-types';
import Layout from '../components/layout';
import { alumniPrefix } from '../../site-config';

const wrapPageElement = ({ element, props }) => {
  const crmData =
    props && props.pageContext && props.pageContext.data
      ? props.pageContext.data.dataCRM
      : null;
  let crumbs =
    props && props.pageContext && props.pageContext.breadcrumb
      ? props.pageContext.breadcrumb.crumbs
      : null;
  if (crumbs)
    crumbs = crumbs.map(c => {
      return {
        pathname: c.pathname,
        crumbLabel:
          c.crumbLabel.charAt(0).toUpperCase() + c.crumbLabel.slice(1),
      };
    });
  const personName = crmData
    ? crmData.nickname
      ? `${crmData.fullName} (${crmData.nickname})`
      : crmData.fullName
    : null;

  const getCrumbLabel = () => {
    // eslint-disable-next-line react/prop-types
    if (props.path === alumniPrefix) {
      return 'Alumni';
    } else if (crmData) {
      return personName;
    } else return null;
  };

  return (
    <Layout
      crumbs={crumbs}
      crumbLabel={getCrumbLabel()}
      pageTitle={getCrumbLabel()}
    >
      <Transition {...props}>{element}</Transition>
    </Layout>
  );
};

wrapPageElement.propTypes = {
  element: PropTypes.any,
  props: PropTypes.any,
  data: PropTypes.any,
  pageContext: PropTypes.any,
};

export default wrapPageElement;
