import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import Layout from '../components/layout';

const Person = ({ data }) => {
	const person = data.people;
	//const frontmatter = person.childMarkdownRemark.frontmatter;
	const profileHtml = person.childMarkdownRemark.html;

	return (
		<Layout>
			<div>
				<h1>{person.name}</h1>
				<dl>
					<dt>Skills</dt>
					{data.skills.advancedSkills.map((skill, i) => (
						<dd key="a{i}">{skill}</dd>
					))}
					{data.skills.intermediateSkills.map((skill, i) => (
						<dd key="i{i}">{skill}</dd>
					))}
				</dl>
				<div
					dangerouslySetInnerHTML={{
						__html: profileHtml,
					}}
				/>
			</div>
		</Layout>
	);
};

Person.propTypes = {
	data: PropTypes.object.isRequired,
};

export default Person;

export const query = graphql`
	query($slug: String!) {
		people: file(sourceInstanceName: { eq: "people" }, name: { eq: $slug }) {
			name
			childMarkdownRemark {
				frontmatter {
					name
					nickname
					role
					category
					current_employee
					blog
					facebook
					linkedin
					location
					qualifications
					quote
					skype
					twitter
					website
				}
				html
			}
		}
		skills: userSkillsCollection(slug: { eq: $slug }) {
			intermediateSkills
			advancedSkills
		}
	}
`;
