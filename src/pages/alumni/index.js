/* eslint-disable no-undef */
// Fix weird build error on some machines
import 'array-flat-polyfill';
import React from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';
import 'array-flat-polyfill';
import { config } from '@fortawesome/fontawesome-svg-core';
import PeopleIndex from '../../components/people-index/people-index';

config.autoAddCss = false;

const Index = ({ data }) => {
  return (
    <>
      <div className="hero-para mx-2 md:mx-6">
        <h1>SSW Alumni</h1>
        Employees that have graced the rooms and corridors of SSW in the past.
      </div>
      <PeopleIndex data={data} current={false} />
    </>
  );
};

Index.propTypes = {
  data: PropTypes.object.isRequired,
  pageContext: PropTypes.object.isRequired,
};

const IndexWithQuery = props => (
  <StaticQuery
    query={graphql`
      query AlumnipageQuery {
        people: allMarkdownRemark {
          nodes {
            frontmatter {
              id
              name
              alternativeUrl
              role
              jobTitle
            }
            parent {
              ... on File {
                name
              }
            }
          }
        }
        profile_images: allFile(
          filter: {
            sourceInstanceName: { eq: "people" }
            name: { glob: "*-Profile" }
          }
        ) {
          nodes {
            name
            childImageSharp {
              fixed(height: 242) {
                ...GatsbyImageSharpFixed_noBase64
              }
            }
          }
        }
        sketch_profile_images: allFile(
          filter: {
            sourceInstanceName: { eq: "people" }
            name: { glob: "*-Sketch" }
          }
        ) {
          nodes {
            name
            childImageSharp {
              fixed(height: 242) {
                ...GatsbyImageSharpFixed_noBase64
              }
            }
          }
        }
        profile_audios: allFile(
          filter: {
            sourceInstanceName: { eq: "people" }
            name: { glob: "*-Audio" }
          }
        ) {
          nodes {
            name
            publicURL
          }
        }
        allCRMData: allCrmDataCollection {
          nodes {
            skills {
              advancedSkills
              intermediateSkills
            }
            fullName
            location
            jobTitle
            role
            billingRate
            nickname
            isActive
            id
          }
        }
        homeJson: homeJson {
          title
          content {
            childMarkdownRemark {
              html
            }
          }
        }
      }
    `}
    render={data => <Index {...data.HomeQuery} {...props} />}
  />
);

export default IndexWithQuery;
