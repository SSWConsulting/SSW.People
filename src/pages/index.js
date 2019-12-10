/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
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

	const searchSkill =
		search.skill === undefined ? '' : getSearchValue(allSkills, search.skill);
	const searchLocation =
		search.location === undefined
			? ''
			: getSearchValue(allLocations, search.location);
	const [selectedSkill, selectSkill] = useState(
		searchSkill === '' ? 'All Skills' : searchSkill
	);
	const [selectedLocation, selectLocation] = useState(
		searchLocation === '' ? 'All Locations' : searchLocation
	);

	return (
		<Layout>
			<div
				dangerouslySetInnerHTML={{
					__html: data.homeJson.content.childMarkdownRemark.html,
				}}
			/>
			<div className="flex mb-4">
				<div className="w-1/4">
					<h3 className="filter-title">I am looking for...</h3>
					<ul>
						{allLocations.map((location, i) => {
							return (
								<li
									key={i}
									id={location}
									className={
										selectedLocation === location
											? 'selected employee-filter'
											: 'employee-filter'
									}
									onClick={() => selectLocation(location)}
								>
									{location}
								</li>
							);
						})}
					</ul>
					<div className="separator-div"></div>
					<ul>
						{allSkills.map((skill, i) => {
							return (
								<li
									key={i}
									id={skill}
									className={
										selectedSkill === skill
											? 'selected employee-filter'
											: 'employee-filter'
									}
									onClick={() => selectSkill(skill)}
								>
									{skill}
								</li>
							);
						})}
					</ul>
				</div>
				<div className="w-3/4">
					{peopleCollection.map((category, i) => {
						var peopleList = getPeople(
							category,
							data,
							selectedSkill,
							selectedLocation
						);
						return (
							peopleList.length > 0 && (
								<div key={i} className={category.name}>
									<h2>{category.name}</h2>
									<div className="flex flex-wrap">
										{peopleList.map((person, y) => {
											return (
												<ProfileBox
													key={y}
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
		var location = element.location;
		if (location != null && allLocations.indexOf(location) === -1) {
			allLocations.push(location);
		}
	});

	allLocations.sort();
	allLocations.unshift('All Locations');
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
	allSkills.unshift('All Skills');
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

function getPeople(
	categoryCollection,
	crmData,
	selectedSkill,
	selectedLocation
) {
	var peopleList = [];
	categoryCollection.people.forEach(person => {
		var personSkills = getPersonSkills(
			person.frontmatter,
			crmData.allSkills.nodes
		);
		var profileImages = getProfileImages(crmData, person.parent.name);
		if (
			(selectedSkill === 'All Skills' ||
				personSkills.skills.indexOf(selectedSkill) !== -1) &&
			profileImages.profileImage != null
		) {
			if (
				selectedLocation === 'All Locations' ||
				personSkills.location === selectedLocation
			) {
				var personToAdd = {
					profile: person.frontmatter,
					sanitisedName: person.parent.name,
					profileImages: profileImages,
				};
				peopleList.push(personToAdd);
			}
		}
	});
	return peopleList;
}

function getSearchValue(allValues, searchTerm) {
	const allValuesToUpperCase = allValues.map(value => {
		return value.toUpperCase();
	});
	const foundIndex = allValuesToUpperCase.indexOf(searchTerm.toUpperCase());
	const searchValue = foundIndex === -1 ? '' : allValues[foundIndex];
	return searchValue;
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
