/* eslint-disable no-undef */
// Fix weird build error on some machines
import 'array-flat-polyfill';
import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';
import { Location } from '@reach/router';
import queryString from 'query-string';
//import { createBrowserHistory } from 'history';
import Layout from 'components/layout';
import ProfileList from 'components/profile-list';
import LocationFilter from '../components/location-filter/location-filter';
import SkillsFilter from '../components/skills-filter/skills-filter';
import RoleFilter from '../components/role-filter/role-filter';
import Distinct from '../helpers/arrayHelpers';
import LocationSanitiser from '../helpers/locationSanitizer';
import 'array-flat-polyfill';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import ProfileSort from '../helpers/profileSort';

config.autoAddCss = false;

const Index = ({
  data,
  pageContext: {
    breadcrumb: { crumbs },
  },
}) => {
  //const history = typeof window !== 'undefined' ? createBrowserHistory() : null;
  const allPeople = useMemo(() => buildPeople(data), [data]);

  const allLocations = useMemo(
    () => [
      'All',
      ...allPeople
        .map(d => d.location)
        .filter(Distinct)
        .filter(l => l.length > 0),
    ],
    [allPeople]
  );

  const allSkills = useMemo(
    () =>
      allPeople
        .map(d => d.skills)
        .flat()
        .filter(Distinct)
        .sort(),
    [allPeople]
  );

  const allRoles = useMemo(
    () =>
      allPeople
        .map(d => d.role)
        .filter(Distinct)
        .sort(),
    [allPeople]
  );

  const [selectedLocation, setSelectedLocation] = useState(allLocations[0]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [filteredPeople, setFilteredPeople] = useState(allPeople);

  useEffect(() => {
    const people = allPeople
      .filter(
        p => selectedLocation === 'All' || p.location === selectedLocation
      )
      .filter(
        p =>
          selectedSkills.length === 0 ||
          selectedSkills.filter(s => p.skills.includes(s)).length > 0
      )
      .sort(ProfileSort);

    setFilteredPeople(people);
  }, [selectedLocation, selectedSkills]);

  return (
    <Layout crumbs={crumbs} displayActions={false}>
      <div
        className="hero-para mx-6"
        dangerouslySetInnerHTML={{
          __html: data.homeJson.content.childMarkdownRemark.html,
        }}
      />
      <div className="my-8 mx-0 xl:mx-6">
        <LocationFilter
          locations={allLocations}
          selectedLocation={selectedLocation}
          onLocationChange={setSelectedLocation}
        />
      </div>
      <div className="mx-6 flex flex-col lg:flex-row">
        <div className="lg:w-1/4">
          <div className="mx-auto flex flex-col sm:flex-row lg:flex-col lg:w-5/6">
            <div className="w-full sm:w-1/2 lg:w-full">
              <RoleFilter
                allRoles={allRoles}
                selectedRoles={selectedRoles}
                onRoleChange={setSelectedRoles}
                filteredPeople={filteredPeople}
              />
            </div>
            <div className="w-full sm:w-1/2 lg:w-full mt-0 lg:mt-4">
              <SkillsFilter
                allSkills={allSkills}
                selectedSkills={selectedSkills}
                onSkillChange={setSelectedSkills}
              />
            </div>
          </div>
        </div>
        <div className="lg:w-3/4">
          <ProfileList
            filteredPeople={filteredPeople.filter(
              p => selectedRoles.length === 0 || selectedRoles.includes(p.role)
            )}
          />
        </div>
      </div>
    </Layout>
  );
};

Index.propTypes = {
  data: PropTypes.object.isRequired,
  search: PropTypes.object.isRequired,
  pageContext: PropTypes.object.isRequired,
};

function buildPeople(data) {
  const profileImageMap = new Map();
  const sketchProfileImageMap = new Map();
  const skillsMap = new Map();
  const locationsMap = new Map();
  const billingRatesMap = new Map();
  const audioMap = new Map();

  data.profile_images.nodes.forEach(n =>
    profileImageMap.set(n.name.replace('-Profile', ''), n.childImageSharp.fixed)
  );
  data.sketch_profile_images.nodes.forEach(n =>
    sketchProfileImageMap.set(
      n.name.replace('-Sketch', ''),
      n.childImageSharp.fixed
    )
  );
  data.allSkills.nodes.forEach(n => {
    skillsMap.set(
      n.fullName,
      [n.skills.advancedSkills, n.skills.intermediateSkills].flat()
    );
    locationsMap.set(n.fullName, n.location);
    billingRatesMap.set(n.fullName, n.billingRate);
  });

  data.profile_audios.nodes.forEach(n =>
    audioMap.set(n.name.replace('-Audio', ''), n.publicURL)
  );

  return data.people.nodes.map(node => {
    return {
      fullName: node.frontmatter.name,
      profile: node.frontmatter,
      location: LocationSanitiser(
        locationsMap.get(node.frontmatter.name) || node.frontmatter.location
      ),
      billingRate: billingRatesMap.get(node.frontmatter.name) || 0,
      sanitisedName: node.parent.name,
      role: node.frontmatter.category,
      profileImages: {
        profileImage: profileImageMap.get(node.parent.name),
        sketchProfileImage: sketchProfileImageMap.get(node.parent.name),
      },
      profileAudio: audioMap.get(node.parent.name),
      skills: skillsMap.get(node.frontmatter.name) || [],
      nickname: node.frontmatter.nickname,
      sanitisedNickname: node.frontmatter.nickname.replace(/\s+/g, '-'),
    };
  });
}

const IndexWithQuery = props => (
  <StaticQuery
    query={graphql`
      query HomepageQuery {
        people: allMarkdownRemark(
          filter: { frontmatter: { currentEmployee: { eq: true } } }
        ) {
          nodes {
            frontmatter {
              category
              currentEmployee
              name
              nickname
              role
              alternativeUrl
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
        homeJson {
          title
          content {
            childMarkdownRemark {
              html
            }
          }
        }
        allSkills: allCrmDataCollection(filter: { id: {} }) {
          nodes {
            skills {
              advancedSkills
              intermediateSkills
            }
            fullName
            location
            billingRate
          }
        }
      }
    `}
    render={data => (
      <Location>
        {({ location }) => (
          <Index
            {...data.HomepageQuery}
            {...props}
            search={location.search ? queryString.parse(location.search) : {}}
          />
        )}
      </Location>
    )}
  />
);

export default IndexWithQuery;
