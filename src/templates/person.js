import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import Layout from '../components/layout';

const Person = ({ data }) => {
	const person = data.people;
	const childMarkdownRemark = person.childMarkdownRemark || {};
	const frontmatter = childMarkdownRemark.frontmatter || {};
	const profileHtml = childMarkdownRemark.html || {};
	const skills = data.skills || {};
	const intermediateSkills = skills.advancedSkills || [];
	const advancedSkills = skills.advancedSkills || [];
	const profileImage = data.profileImage.nodes[0];

	return (
		<Layout>
			<div className="flex mb-4">
				<div className="w-1/4">
					<div
						className="relative bg-cover shadow-lg mx-auto"
						style={{
							backgroundImage: `url(${profileImage.childImageSharp.original.src})`,
							height: `${profileImage.childImageSharp.original.height}px`,
							width: `${profileImage.childImageSharp.original.width}px`,
						}}
					></div>
				</div>
				<div className="w-3/4">
					<h1>{frontmatter.name}</h1>
					<dl>
						<dt>Position:</dt>
						<dd>{frontmatter.role}</dd>
					</dl>
					<dl>
						<dt>Qualification:</dt>
						<dd>{frontmatter.qualifications}</dd>
					</dl>
					<dl>
						<dt>Location:</dt>
						<dd>{frontmatter.location}</dd>
					</dl>
					<dl>
						<dt>Skills:</dt>
						{advancedSkills.map((skill, i) => (
							<dd key={`a${i}`}>{skill}</dd>
						))}
						{intermediateSkills.map((skill, i) => (
							<dd key={`i${i}`}>{skill}</dd>
						))}
					</dl>

					<div
						dangerouslySetInnerHTML={{
							__html: profileHtml,
						}}
					/>
				</div>
			</div>
		</Layout>
	);
};

Person.propTypes = {
	data: PropTypes.object.isRequired,
};

export default Person;

export const query = graphql`
	query($slug: String!, $squareImage: String!) {
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
		profileImage: allFile(
			filter: {
				sourceInstanceName: { eq: "people" }
				name: { glob: $squareImage }
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
	}
`;
