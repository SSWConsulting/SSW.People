import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ProfileBox from 'components/profile-box';
import Distinct from '../../helpers/arrayHelpers';
import RoleSort from '../../helpers/roleSort';
import CheckUniqueName from '../../helpers/CheckUniqueName';

function getSkillsFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const skills = [];

  for (const [key, value] of params) {
    if (key === 'skill') {
      const skillName = decodeURIComponent(value).replaceAll('-', ' ');
      skills.push(skillName);
    }
  }

  return skills;
}

const ProfileList = ({ filteredPeople }) => {
  const [skillFilter, setSkillFilter] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const skills = getSkillsFromQuery().join(' & ');
      setSkillFilter(skills);
    }
  }, [filteredPeople]);

  const distinctRoles = filteredPeople
    .map((p) => p.role)
    .filter(Distinct)
    .sort(RoleSort);

  const getPeopleInRole = (role) => {
    return filteredPeople.filter((p) => p.role === role);
  };
  const firstNameList = filteredPeople.map((person) => {
    return person.profile.fullName.split(' ')[0].toLowerCase();
  });
  return (
    <>
      {distinctRoles.map((role, index) => {
        const people = getPeopleInRole(role);
        return (
          people.length > 0 && (
            <section key={index} className={'role-section mb-8 ' + role}>
              <h2 className="mb-2">{role}</h2>
              {skillFilter && index === 0 && (
                <p className="mb-2">Filter: Technologies — {skillFilter}</p>
              )}
              <div className="people-grid-container">
                {people.map((person, id) => {
                  return (
                    <ProfileBox
                      key={id}
                      profile={person.profile}
                      sanitisedName={person.sanitisedName}
                      profileImages={person.profileImages}
                      profileAudio={person.profileAudio}
                      isUniqueName={CheckUniqueName(
                        firstNameList,
                        person.profile.nickname.toLowerCase()
                      )}
                    />
                  );
                })}
              </div>
            </section>
          )
        );
      })}
    </>
  );
};

ProfileList.propTypes = {
  filteredPeople: PropTypes.array.isRequired,
};

export default ProfileList;
