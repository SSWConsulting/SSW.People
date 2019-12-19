/* eslint-disable no-undef */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Layout from 'components/layout';
import { StaticQuery, graphql } from 'gatsby';
import ProfileBox from 'components/profile-box';
import { Location } from '@reach/router';
import queryString from 'query-string';

const Index = ({ data, search }) => {
	const managers = {
		name: 'Managers',
		people: data.managers.nodes,
	};
	const developers = {
		name: 'Developers',
		people: data.developers.nodes,
	};
	const designers = {
		name: 'Designers',
		people: data.designers.nodes,
	};
	const admin = {
		name: 'Admin',
		people: data.admin.nodes,
	};

	const peopleCollection = [managers, developers, designers, admin];

	const allSkills = getAllSkills(data.allSkills.nodes);

	const allLocations = getAllLocations(data.allSkills.nodes);

	const [selectedLocation, selectLocation] = useState('All');

	const [checkedSkills, setSkill] = useState(new Map());

	const [checkedRoles, setRole] = useState(new Map());

	const handleSkillChange = e => {
		const item = e.target.name;
		const isChecked = e.target.checked;
		setSkill(new Map(checkedSkills.set(item, isChecked)));
	};

	const handleRoleChange = e => {
		const item = e.target.name;
		const isChecked = e.target.checked;
		setRole(new Map(checkedRoles.set(item, isChecked)));
	};

	const selectedSkills = getSelectedValues(checkedSkills);

	const selectedRoles = getSelectedValues(checkedRoles);

	let roleFilters = new Map();

	let filteredCollection = [];

	peopleCollection.forEach(category => {
		let peopleList = getPeopleFilteredBySkillsAndLocation(
			category,
			data,
			selectedSkills,
			selectedLocation
		);
		roleFilters.set(category.name, peopleList.length);
		filteredCollection.push({ name: category.name, peopleList: peopleList });
	});

	return (
		<Layout>
			<div
				dangerouslySetInnerHTML={{
					__html: data.homeJson.content.childMarkdownRemark.html,
				}}
			/>
			{/* TODO: style the location banner */}
			<div className="filter-location mb-8 py-4 pl-96 text-16">
				<div className="items-center flex">
					{allLocations.map((location, i) => {
						return (
							<button
								key={i}
								id={location}
								className={
									selectedLocation === location
										? 'filter-location-selected mr-12'
										: 'mr-12'
								}
								onClick={() => selectLocation(location)}
							>
								{location}
							</button>
						);
					})}
				</div>
			</div>
			<div className="flex mb-4">
				<div className="w-1/4">
					<div className="filter-role">
						{Array.from(roleFilters).map(([key, value]) => (
							<div key={key}>
								<label>
									<input
										type="checkbox"
										name={key}
										checked={!!checkedRoles.get(key)}
										onChange={handleRoleChange}
									/>
									{`${key} ${value}`}
								</label>
							</div>
						))}
					</div>
					<h3 className="filter-title">Technologies</h3>
					<div className="filter-skills">
						{allSkills.map((skill, i) => (
							<div key={i}>
								<label>
									<input
										type="checkbox"
										name={skill}
										checked={!!checkedSkills.get(skill)}
										onChange={handleSkillChange}
									/>
									{skill}
								</label>
							</div>
						))}
					</div>
				</div>
				<div className="w-3/4">
					{filteredCollection.map((category, i) => {
						const peopleList = getPeopleFilteredByRoles(
							category.peopleList,
							selectedRoles
						);
						return (
							peopleList.length > 0 && (
								<div key={i} className={category.name}>
									<h2>{category.name}</h2>
									<div className="flex flex-wrap">
										{peopleList.map((person, y) => {
											if (
												selectedRoles[0] === 'All' ||
												selectedRoles.indexOf(person.profile.category) !== -1
											) {
												return (
													<ProfileBox
														key={y}
														profile={person.profile}
														sanitisedName={person.sanitisedName}
														profileImages={person.profileImages}
													/>
												);
											}
										})}
									</div>
								</div>
							)
						);
					})}
				</div>
			</div>
		</Layout>
	);
};

function getProfileImages(crmData, name) {
	const profileImage = crmData.profile_images.nodes.find(
		n => n.name === `${name}-Profile`
	);
	const sketchProfileImage = crmData.sketch_profile_images.nodes.find(
		n => n.name === `${name}-Sketch`
	);

	var profileImages = {
		profileImage: profileImage,
		sketchProfileImage: sketchProfileImage,
	};
	return profileImages;
}

function getAllLocations(crmData) {
	var allLocations = [];
	crmData.forEach(element => {
		var location =
			element.location === 'Other' ? 'ElseWhere' : element.location;
		if (location != null && allLocations.indexOf(location) === -1) {
			allLocations.push(location);
		}
	});

	allLocations.unshift('All');
	return allLocations;
}

function getAllSkills(crmData) {
	var allSkills = [];
	crmData.forEach(element => {
		element.skills.advancedSkills.forEach(skill => {
			if (skill !== null && allSkills.indexOf(skill) === -1) {
				allSkills.push(skill);
			}
		});
		element.skills.intermediateSkills.forEach(skill => {
			if (skill !== null && allSkills.indexOf(skill) === -1) {
				allSkills.push(skill);
			}
		});
	});

	allSkills.sort();
	return allSkills;
}

function getPersonSkills(person, crmDataSkills) {
	var personSkills = {
		skills: [],
		location: '',
	};
	for (var i = 0; i < crmDataSkills.length; i++) {
		if (crmDataSkills[i].fullName === person.name) {
			personSkills.skills = crmDataSkills[i].skills.advancedSkills.concat(
				crmDataSkills[i].skills.intermediateSkills
			);
			personSkills.location = crmDataSkills[i].location;
			break;
		}
	}
	return personSkills;
}

function getPeopleFilteredBySkillsAndLocation(
	categoryCollection,
	crmData,
	selectedSkills,
	selectedLocation
) {
	let peopleList = [];
	categoryCollection.people.forEach(person => {
		var personSkills = getPersonSkills(
			person.frontmatter,
			crmData.allSkills.nodes
		);
		let profileImages = getProfileImages(crmData, person.parent.name);
		selectedSkills.forEach(selectedSkill => {
			if (
				(selectedSkill === 'All' ||
					personSkills.skills.indexOf(selectedSkill) !== -1) &&
				profileImages.profileImage != null
			) {
				if (
					selectedLocation === 'All' ||
					personSkills.location === selectedLocation ||
					personSkills.location === 'Other'
				) {
					var personToAdd = {
						profile: person.frontmatter,
						sanitisedName: person.parent.name,
						profileImages: profileImages,
					};
					if (!personAlreadyAdded(personToAdd, peopleList)) {
						peopleList.push(personToAdd);
					}
				}
			}
		});
	});
	return peopleList;
}

function getPeopleFilteredByRoles(peopleList, selectedRoles) {
	let filteredPeopleList = [];
	peopleList.forEach(person => {
		if (
			selectedRoles[0] === 'All' ||
			selectedRoles.indexOf(person.profile.category) !== -1
		) {
			filteredPeopleList.push(person);
		}
	});
	return filteredPeopleList;
}

function getSelectedValues(checkedList) {
	const selectedValues = [];
	for (let [key, value] of checkedList) {
		if (value) {
			selectedValues.push(key);
		}
	}
	if (selectedValues.length === 0) {
		selectedValues.push('All');
	}
	return selectedValues;
}

function personAlreadyAdded(personToAdd, peopleList) {
	for (let i = 0; i < peopleList.length; i++) {
		if (peopleList[i].sanitisedName === personToAdd.sanitisedName) {
			return true;
		}
	}
	return false;
}

Index.propTypes = {
	data: PropTypes.object.isRequired,
	search: PropTypes.object.isRequired,
};

const IndexWithQuery = props => (
	<StaticQuery
		query={graphql`
			query HomepageQuery {
				managers: allMarkdownRemark(
					filter: {
						frontmatter: {
							current_employee: { eq: true }
							category: { eq: "Managers" }
						}
					}
					sort: { fields: frontmatter___nickname }
				) {
					nodes {
						frontmatter {
							category
							current_employee
							location
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
				developers: allMarkdownRemark(
					filter: {
						frontmatter: {
							current_employee: { eq: true }
							category: { eq: "Developers" }
						}
					}
					sort: { fields: frontmatter___nickname }
				) {
					nodes {
						frontmatter {
							category
							current_employee
							location
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
				designers: allMarkdownRemark(
					filter: {
						frontmatter: {
							current_employee: { eq: true }
							category: { eq: "Designers" }
						}
					}
					sort: { fields: frontmatter___nickname }
				) {
					nodes {
						frontmatter {
							category
							current_employee
							location
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
				admin: allMarkdownRemark(
					filter: {
						frontmatter: {
							current_employee: { eq: true }
							category: { eq: "Admin" }
						}
					}
					sort: { fields: frontmatter___nickname }
				) {
					nodes {
						frontmatter {
							category
							current_employee
							location
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
