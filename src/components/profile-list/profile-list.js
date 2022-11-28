import React from 'react';
import PropTypes from 'prop-types';
import ProfileBox from 'components/profile-box';
import Distinct from '../../helpers/arrayHelpers';
import RoleSort from '../../helpers/roleSort';

const ProfileList = ({ filteredPeople }) => {
  const distinctRoles = filteredPeople
    .map((p) => p.role)
    .filter(Distinct)
    .sort(RoleSort);

  const getPeopleInRole = (role) => {
    return filteredPeople.filter((p) => p.role === role);
  };

  return (
    <>
      {distinctRoles.map((role, i) => {
        const people = getPeopleInRole(role);
        return (
          people.length > 0 && (
            <section key={i} className={'role-section mb-8 ' + role}>
              <h2 className="mb-2">{role}</h2>
              <div className="people-grid-container">
                {people.map((person, id) => {
                  return (
                    <ProfileBox
                      key={id}
                      profile={person.profile}
                      sanitisedName={person.sanitisedName}
                      profileImages={person.profileImages}
                      sanitisedNickname={person.sanitisedNickname}
                      profileAudio={person.profileAudio}
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
