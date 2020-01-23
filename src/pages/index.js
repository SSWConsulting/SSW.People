/* eslint-disable no-undef */
// Fix weird build error on some machines
import 'array-flat-polyfill';
import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql, withPrefix } from 'gatsby';
import { Location } from '@reach/router';
import queryString from 'query-string';
import { createBrowserHistory } from 'history';
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

config.autoAddCss = false;

const Index = ({ data, search }) => {
  const history = typeof window !== 'undefined' ? createBrowserHistory() : null;

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
      );
    setFilteredPeople(people);
  }, [selectedLocation, selectedSkills]);

  useEffect(() => {
    // TODO: load search params from querystring
    // TODO: push search params to querystring
    history.push({
      pathname: withPrefix('/'),
      search: '',
    });
  }, [selectedLocation, selectedSkills, selectedRoles]);

  return (
    <Layout displayActions={false}>
      <div
        className="mx-6"
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
};

function buildPeople(data) {
  const profileImageMap = new Map();
  const sketchProfileImageMap = new Map();
  const skillsMap = new Map();
  const locationsMap = new Map();

  data.profile_images.nodes.forEach(n =>
    profileImageMap.set(
      n.name.replace('-Profile', ''),
      n.childImageSharp.original.src
    )
  );
  data.sketch_profile_images.nodes.forEach(n =>
    sketchProfileImageMap.set(
      n.name.replace('-Sketch', ''),
      n.childImageSharp.original.src
    )
  );
  data.allSkills.nodes.forEach(n => {
    skillsMap.set(
      n.fullName,
      [n.skills.advancedSkills, n.skills.intermediateSkills].flat()
    );
    locationsMap.set(n.fullName, n.location);
  });

  return data.people.nodes.map(node => {
    return {
      fullName: node.frontmatter.name,
      profile: node.frontmatter,
      location: LocationSanitiser(
        locationsMap.get(node.frontmatter.name) || node.frontmatter.location
      ),
      sanitisedName: node.parent.name,
      role: node.frontmatter.category,
      profileImages: {
        profileImage: profileImageMap.get(node.parent.name),
        sketchProfileImage: sketchProfileImageMap.get(node.parent.name),
      },
      skills: skillsMap.get(node.frontmatter.name) || [],
    };
  });
}

const IndexWithQuery = props => (
  <StaticQuery
    query={graphql`
      query HomepageQuery {
        people: allMarkdownRemark(
          filter: { frontmatter: { current_employee: { eq: true } } }
          sort: { fields: frontmatter___nickname }
        ) {
          nodes {
            frontmatter {
              category
              current_employee
              name
              nickname
              role
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
              original {
                height
                src
                width
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
              original {
                height
                src
                width
              }
            }
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
