import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import Layout from '../components/layout';

const Person = ({ data }) => {
	const person = data.people.edges[0].node;
	const frontmatter = person.childMarkdownRemark.frontmatter;
	const profileHtml = person.childMarkdownRemark.html;

	//console.log(frontmatter);

	return (
		<Layout>
			<div>
				<h1>{person.name}</h1>
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
		people: allFile(
			limit: 1
			filter: { sourceInstanceName: { eq: "people" }, name: { eq: $slug } }
		) {
			edges {
				node {
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
			}
		}
	}
`;
