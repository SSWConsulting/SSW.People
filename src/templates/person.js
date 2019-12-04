import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import Layout from '../components/layout';

const Person = ({ data }) => {
  const person = data.people;
  const childMarkdownRemark = person.childMarkdownRemark || {};
	const frontmatter = childMarkdownRemark.frontmatter || {};
	const profileHtml = childMarkdownRemark.html || {};
  const crmData = data.crmData || {};
  const skills = crmData.skills || {};
  const intermediateSkills = skills.intermediateSkills || [];
  const advancedSkills = skills.advancedSkills || [];

	return (
		<Layout>
			<div>
				<h1>{frontmatter.name}</h1>
				<dl>
					<dt>Position</dt>
					<dd>{frontmatter.role}</dd>
				</dl>
				<dl>
					<dt>Qualification</dt>
					<dd>{frontmatter.qualifications}</dd>
				</dl>
				<dl>
					<dt>Location</dt>
					<dd>{crmData.location}</dd>
				</dl>
				<dl>
          <dt>Skills</dt>
          {
            advancedSkills.map((skill, i) => (
              <dd key={`a${i}`}>{skill}</dd>
            ))
          }
          {
            intermediateSkills.map((skill, i) => (
              <dd key={`i${i}`}>{skill}</dd>
            ))
          }
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
		crmData: crmDataCollection(slug: { eq: $slug }) {
			skills {
        intermediateSkills
        advancedSkills
      }
      location: location
      emailAddress: emailAddress
    }

	}
`;
