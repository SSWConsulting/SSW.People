import React from 'react';
import PropTypes from 'prop-types';
import ProfileBox from 'components/profile-box';
import Distinct from '../../helpers/arrayHelpers';
import RoleSort from '../../helpers/roleSort';

const ProfileList = ({ filteredPeople }) => {
	const distinctRoles = filteredPeople
		.map(p => p.role)
		.filter(Distinct)
		.sort(RoleSort);

	const getPeopleInRole = role => {
		return filteredPeople.filter(p => p.role === role);
	};

	return (
		<>
			{distinctRoles.map((role, i) => {
				const people = getPeopleInRole(role);
				return (
					people.length > 0 && (
						<div key={i} className={role}>
							<h2 className="pl-4">{role}</h2>
							<div className="flex flex-wrap">
								{people.map((person, id) => {
									return (
										<ProfileBox
											key={id}
											profile={person.profile}
											sanitisedName={person.sanitisedName}
											profileImages={person.profileImages}
										/>
									);
								})}
							</div>
						</div>
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
