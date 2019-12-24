/* eslint-disable no-undef */
import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';
import { Location } from '@reach/router';
import queryString from 'query-string';
import Layout from 'components/layout';
import ProfileList from 'components/profile-list';
import LocationFilter from '../components/location-filter/location-filter';
import SkillsFilter from '../components/skills-filter/skills-filter';
import RoleFilter from '../components/role-filter/role-filter';
import Distinct from '../helpers/arrayHelpers';
import LocationSanitiser from '../helpers/valueHelpers';

const Index = ({ data, search }) => {
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
	const [selectedRoles, setSelectedRoles] = useState(allRoles);
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

	return (
		<Layout>
			<div
				dangerouslySetInnerHTML={{
					__html: data.homeJson.content.childMarkdownRemark.html,
				}}
			/>
			<div className="filter-location mb-8 py-4 pl-96 text-16">
				<LocationFilter
					locations={allLocations}
					selectedLocation={selectedLocation}
					onLocationChange={setSelectedLocation}
				/>
			</div>
			<div className="flex">
				<div className="w-1/4">
					<RoleFilter
						allRoles={allRoles}
						selectedRoles={selectedRoles}
						onRoleChange={setSelectedRoles}
						filteredPeople={filteredPeople}
					/>
					<SkillsFilter
						allSkills={allSkills}
						selectedSkills={selectedSkills}
						onSkillChange={setSelectedSkills}
					/>
				</div>
				<div className="w-3/4">
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
	data.allSkills.nodes.forEach(n =>
		skillsMap.set(
			n.fullName,
			[n.skills.advancedSkills, n.skills.intermediateSkills].flat()
		)
	);

	return data.people.nodes.map(node => {
		return {
			fullName: node.frontmatter.name,
			profile: node.frontmatter,
			location: LocationSanitiser(node.frontmatter.location),
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
