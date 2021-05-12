/* eslint-disable no-undef */
// Fix weird build error on some machines
import 'array-flat-polyfill';
import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';
import { Location } from '@reach/router';
import queryString from 'query-string';
import ProfileList from 'components/profile-list';
import LocationFilter from '../components/location-filter/location-filter';
import Distinct from '../helpers/arrayHelpers';
import LocationSanitiser from '../helpers/locationSanitizer';
import 'array-flat-polyfill';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import ProfileSort from '../helpers/profileSort';
import {
  getEventsPresenters,
  isPresenterOfEventType,
} from '../helpers/eventHelper';
import { getPresentersOfEventType } from '../helpers/eventHelper';
import RoleSort from '../helpers/roleSort';
import PeopleFilters from '../components/people-filters/people-filters';
import LinkAlumni from '../components/link-alumni/link-alumni';

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
  const countPerEvent = () => {
    return allEventsType.map(r => {
      return {
        item: r,
        count: getPresentersOfEventType(r, eventsPresenters, filteredPeople)
          .length,
      };
    });
  };
  const countPerSkill = () => {
    return allSkills.map(r => {
      return {
        item: r,
        count: filteredPeople.filter(p => p.skills.find(s => s === r)).length,
      };
    });
  };

  const [selectedLocation, setSelectedLocation] = useState(allLocations[0]);
  const [filteredPeople, setFilteredPeople] = useState(allPeople);
  const [eventsPresenters, setEventsPresenters] = useState(null);
  const [allEventsType, setAllEventsType] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([
    { name: 'roles', selected: [] },
    { name: 'skills', selected: [] },
    { name: 'events', selected: [] },
  ]);

  useEffect(() => {
    function filterPeople() {
      const selectedRoles = selectedFilters.find(f => f.name === 'roles')
        ?.selected;
      const selectedSkills = selectedFilters.find(f => f.name === 'skills')
        ?.selected;
      const selectedEvents = selectedFilters.find(f => f.name === 'events')
        ?.selected;

      const people = allPeople
        .filter(
          p =>
            selectedLocation === 'All' ||
            p.location === selectedLocation ||
            p.sanitisedName === 'We-are-hiring'
        )
        .filter(
          p => selectedRoles.length === 0 || selectedRoles.includes(p.role)
        )
        .filter(
          p =>
            selectedSkills.length === 0 ||
            selectedSkills.filter(s => p.skills.includes(s)).length > 0
        )
        .filter(
          p =>
            selectedEvents.length === 0 ||
            selectedEvents.filter(e =>
              isPresenterOfEventType(e, p.profile, eventsPresenters)
            ).length > 0
        );
      return people;
    }

    async function loadEventsPresenters() {
      var presentersList = await getEventsPresenters();
      setEventsPresenters(presentersList);
      setAllEventsType([
        ...new Set(presentersList.map(event => event.eventType)),
      ]);
    }

    if (!eventsPresenters) {
      loadEventsPresenters();
    }

    const people = filterPeople().sort(ProfileSort);
    setFilteredPeople(people);
  }, [selectedLocation, selectedFilters]);

  return (
    <>
      <div
        className="hero-para mx-2 md:mx-6"
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
      <div className="mx-2 md:mx-6 flex flex-col lg:flex-row">
        <div className="lg:w-1/4">
          <div className="mx-auto flex flex-col sm:flex-row lg:flex-col lg:w-5/6">
            <PeopleFilters
              allRoles={allRoles}
              rolesCount={countPerRole()}
              allSkills={allSkills}
              skillsCount={countPerSkill()}
              allEvents={allEventsType}
              eventsCount={countPerEvent()}
              onFilterChange={setSelectedFilters}
            />
          </div>
        </div>
        <div className="relative lg:w-3/4 overflow-hidden">
          <ProfileList filteredPeople={filteredPeople} />

          <div className="absolute bottom-0 right-0 alumniLink h-16">
            <LinkAlumni />
          </div>
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
    .filter(x => x.isActive)
    .map(n => {
      return n;
    });

  return data.people.nodes
    .map(node => {
      const dataCRM = allDataCRM.find(x => x.id === node.frontmatter.id);
      const isFixedTile = node.parent.name === 'We-are-hiring';
      if ((dataCRM && dataCRM.isActive) || isFixedTile) {
        const jobTitle = !isFixedTile
          ? dataCRM.jobTitle
            ? dataCRM.jobTitle
            : node.frontmatter.jobTitle
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
          billingRate: !isFixedTile ? dataCRM.billingRate : 0,
          sanitisedName: node.parent.name,
          jobTitle: jobTitle,
          role: !isFixedTile
            ? dataCRM.role
              ? dataCRM.role
              : node.frontmatter.role
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
            ? dataCRM.nickname.replace(/\s+/g, '-')
            : node.parent.name,
        };
      }
    })
    .filter(x => x !== undefined)
    .filter(x => !x.sanitisedName.endsWith(profileChineseTag));
}

const IndexWithQuery = props => (
  <StaticQuery
    query={graphql`
      query HomepageQuery {
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
        homeJson {
          title
          content {
            childMarkdownRemark {
              html
            }
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
