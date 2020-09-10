import React from 'react';
import Transition from 'components/transition';
import PropTypes from 'prop-types';
import Layout from '../components/layout';

const wrapPageElement = ({ element, props }) => {
  const crmData =
    props && props.pageContext && props.pageContext.data
      ? props.pageContext.data.dataCRM
      : null;
  const crumbs =
    props && props.pageContext && props.pageContext.breadcrumb
      ? props.pageContext.breadcrumb.crumbs
      : null;
  const personName = crmData
    ? crmData.nickname
      ? `${crmData.fullName} (${crmData.nickname})`
      : crmData.fullName
    : null;

  return (
    <Layout
      crumbs={crumbs}
      crumbLabel={personName}
      pageTitle={crmData && personName}
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
