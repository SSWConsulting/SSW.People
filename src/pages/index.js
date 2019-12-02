import React from 'react';
import PropTypes from 'prop-types';
import Layout from 'components/layout';
import { graphql } from 'gatsby';
import ProfileBox from 'components/profile-box';

const Index = ({ data }) => (
	<Layout>
		<div
			dangerouslySetInnerHTML={{
				__html: data.homeJson.content.childMarkdownRemark.html,
			}}
		/>

		<div className="flex flex-wrap">
			{data.people.nodes.map((item, i) => (
				<ProfileBox
					key={i}
					profile={item.frontmatter}
					sanitisedName={item.parent.name}
					profileImages={data.profile_images.nodes}
				/>
			))}
		</div>
	</Layout>
);

Index.propTypes = {
	data: PropTypes.object.isRequired,
};

export default Index;

export const query = graphql`
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
		homeJson {
			title
			content {
				childMarkdownRemark {
					html
				}
			}
		}
	}
`;
