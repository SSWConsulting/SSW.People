import React from 'react';
import PropTypes from 'prop-types';
import Layout from 'components/layout';
import { graphql } from 'gatsby';

const Profile = ({ profile, sanitisedName, profileImages }) => {
	const profileImage = profileImages.find(
		n => n.name === `${sanitisedName}-Profile`
	);
	return (
		<div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 mb-4">
			<div
				className="relative bg-cover shadow-lg mx-auto"
				style={{
					backgroundImage: `url(${profileImage.childImageSharp.original.src})`,
					height: `${profileImage.childImageSharp.original.height}px`,
					width: `${profileImage.childImageSharp.original.width}px`,
				}}
			>
				<div
					className="absolute inset-x-0 bottom-0 px-6 pb-4 h-20"
					style={{
						backgroundColor: 'rgba(200,200,200,0.5)',
						backdropFilter: 'blur(10px)',
					}}
				>
					<p className="font-bold text-xl">{profile.nickname}</p>
					<p className="text-gray-700 text-sm">{profile.role}</p>
				</div>
			</div>
		</div>
	);
};

Profile.propTypes = {
	profile: PropTypes.object.isRequired,
	sanitisedName: PropTypes.string.isRequired,
	profileImages: PropTypes.array.isRequired,
};

const Index = ({ data }) => (
	<Layout>
		<div
			dangerouslySetInnerHTML={{
				__html: data.homeJson.content.childMarkdownRemark.html,
			}}
		/>

		<div className="flex flex-wrap">
			{data.people.nodes.map((item, i) => (
				<Profile
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
					name
					nickname
					category
					current_employee
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
