/* eslint-disable no-undef */
// Fix weird build error on some machines
import 'array-flat-polyfill';
import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';
import 'array-flat-polyfill';
import { config } from '@fortawesome/fontawesome-svg-core';
import { Location } from '@reach/router';
import Filter from '../../components/filter/filter';
import RoleSort from '../../helpers/roleSort';
import ProfileSort from '../../helpers/profileSort';
import LocationFilter from '../../components/location-filter/location-filter';
import LocationSanitiser from '../../helpers/locationSanitizer';
import Distinct from '../../helpers/arrayHelpers';
import ProfileList from 'components/profile-list';
import queryString from 'query-string';

config.autoAddCss = false;
const profileChineseTag = '-Chinese';

const Index = ({ data }) => {
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

  const allRoles = useMemo(
    () =>
      allPeople
        .map(d => d.role)
        .filter(Distinct)
        .sort(RoleSort),
    [allPeople]
  );
  const countPerRole = () => {
    return allRoles.map(r => {
      return {
        item: r,
        count: filteredPeople.filter(p => p.role === r).length,
      };
    });
  };
  const [selectedLocation, setSelectedLocation] = useState(allLocations[0]);
  const [filteredPeople, setFilteredPeople] = useState(allPeople);
  const [selectedRoles, setSelectedRoles] = useState([]);

  useEffect(() => {
    const people = allPeople
      .filter(
        p =>
          selectedLocation === 'All' ||
          p.location === selectedLocation ||
          p.sanitisedName === 'We-are-hiring'
      )
      .filter(p => selectedRoles.length === 0 || selectedRoles.includes(p.role))
      .sort(ProfileSort);

    setFilteredPeople(people);
  }, [selectedLocation, selectedRoles]);

  return (
    <>
      <div className="hero-para mx-2 md:mx-6">
        <h1>SSW Alumni</h1>
        Employees that have graced the rooms and corridors of SSW in the past.
      </div>
      <div className="my-8 mx-0 xl:mx-6">
        <LocationFilter
          locations={allLocations}
          selectedLocation={selectedLocation}
          onLocationChange={setSelectedLocation}
        />
      </div>
      <div className="mx-2 md:mx-6 flex flex-col lg:flex-row">
        <div className="lg:w-1/4">
          <div className="mx-auto flex flex-col sm:flex-row lg:flex-col lg:w-5/6">
            <div className="w-full sm:w-1/2 lg:w-full">
              <Filter
                filterTitle="Roles"
                filterUrlTitle="role"
                allFilterItems={allRoles}
                selectedItems={selectedRoles}
                onItemChange={setSelectedRoles}
                filterCounts={countPerRole()}
              />
            </div>
          </div>
        </div>
        <div className="lg:w-3/4">
          <ProfileList filteredPeople={filteredPeople} />
        </div>
      </div>
    </>
  );
};

Index.propTypes = {
  data: PropTypes.object.isRequired,
  search: PropTypes.object.isRequired,
  pageContext: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

function buildPeople(data) {
  const profileImageMap = new Map();
  const sketchProfileImageMap = new Map();
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
  data.profile_audios.nodes.forEach(n =>
    audioMap.set(n.name.replace('-Audio', ''), n.publicURL)
  );

  const allDataCRM = data.allCRMData.nodes
    .filter(x => !x.isActive)
    .map(n => {
      return n;
    });

  const people = data.people.nodes.filter(
    node =>
      allDataCRM.find(x => x.id === node.frontmatter.id && !x.isActive) ||
      (node.frontmatter.id && node.frontmatter.id.indexOf('-') < 0)
  );

  return people
    .map(node => {
      const dataCRM = allDataCRM.find(x => x.id === node.frontmatter.id);
      const isFixedTile = node.parent.name === 'We-are-hiring';
      if (dataCRM || isFixedTile) {
        const jobTitle = !isFixedTile
          ? dataCRM.jobTitle.replace(/Mr/, '').replace(/Ms/, '')
            ? dataCRM.jobTitle
            : node.frontmatter.jobTitle
            ? node.frontmatter.jobTitle
            : ''
          : 'enthusiastic People';
        return {
          profile: {
            ...node.frontmatter,
            fullName: !isFixedTile ? dataCRM.fullName : node.frontmatter.name,
            nickname: !isFixedTile ? dataCRM.nickname : node.frontmatter.name,
            jobTitle: jobTitle,
          },
          location: LocationSanitiser(
            !isFixedTile ? dataCRM.location : 'Others'
          ),
          billingRate: !isFixedTile ? dataCRM.billingRate : -100,
          sanitisedName: 'alumni/' + node.parent.name,
          jobTitle: jobTitle,
          role: !isFixedTile
            ? dataCRM.role
              ? dataCRM.role
              : node.frontmatter.role
              ? node.frontmatter.role
              : 'Others'
            : 'Developers',
          profileImages: {
            profileImage: profileImageMap.get(
              node.parent.name.replace(profileChineseTag, '')
            ),
            sketchProfileImage: sketchProfileImageMap.get(
              node.parent.name.replace(profileChineseTag, '')
            ),
          },
          profileAudio: audioMap.get(
            node.parent.name.replace(profileChineseTag, '')
          ),
          skills: !isFixedTile
            ? [
                dataCRM.skills.advancedSkills,
                dataCRM.skills.intermediateSkills,
              ].flat()
            : [],
          sanitisedNickname: !isFixedTile
            ? 'alumni/' + dataCRM.nickname.replace(/\s+/g, '-')
            : node.parent.name,
        };
      } else {
        const jobTitle = node.frontmatter.jobTitle;
        if (node.frontmatter.name) {
          return {
            profile: {
              ...node.frontmatter,
              fullName: node.frontmatter.name || ' ',
              nickname: node.frontmatter.name,
              jobTitle: jobTitle,
            },
            location: 'Others',
            billingRate: 0,
            sanitisedName: 'alumni/' + node.parent.name,
            jobTitle: jobTitle,
            role: node.frontmatter.role,
            profileImages: {
              profileImage: profileImageMap.get(
                node.parent.name.replace(profileChineseTag, '')
              ),
              sketchProfileImage: sketchProfileImageMap.get(
                node.parent.name.replace(profileChineseTag, '')
              ),
            },
            profileAudio: audioMap.get(
              node.parent.name.replace(profileChineseTag, '')
            ),
            skills: [],
            sanitisedNickname: 'alumni/' + node.parent.name,
          };
        }
      }
    })
    .filter(x => x !== undefined)
    .filter(x => !x.sanitisedName.endsWith(profileChineseTag));
}

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
      }
    `}
    render={data => (
      <Location>
        {({ location }) => (
          <Index
            data={data}
            {...props}
            search={location.search ? queryString.parse(location.search) : {}}
          />
        )}
      </Location>
    )}
  />
);

export default IndexWithQuery;
