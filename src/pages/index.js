import React from 'react';
import PropTypes from 'prop-types';
import Layout from 'components/layout';
import { graphql } from 'gatsby';
import ProfileBox from 'components/profile-box';

class Index extends React.Component {
	constructor(props) {
		super(props);
		this.selectSkill = this.selectSkill.bind(this);
	}

	state = { selectedSkill: 'All Skills' };

	selectSkill(event) {
		this.setState({ selectedSkill: event.target.id });
	}

	render() {
		const { data } = this.props;
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

		const collection = [managers, developers, designers, admin];

		const allSkills = this.getAllSkills(data.allSkills.nodes);

		return (
			<Layout>
				<div
					dangerouslySetInnerHTML={{
						__html: data.homeJson.content.childMarkdownRemark.html,
					}}
				/>
				<div className="flex mb-4">
					<div className="w-1/4">
						<ul>
							{allSkills.map((skill, i) => {
								return (
									<li key={i}>
										<button id={skill} onClick={this.selectSkill}>
											{skill}
										</button>
									</li>
								);
							})}
						</ul>
					</div>
					<div className="w-3/4">
						{collection.map((category, i) => {
							return (
								<div key={i} className={category.name}>
									<h1>{category.name}</h1>
									<div className="flex flex-wrap">
										{category.people.map((item, i) => {
											var personSkills = this.getPersonSkills(
												item.frontmatter,
												data.allSkills.nodes
											);
											// console.log(
											// 	personSkills.indexOf(this.state.selectedSkill) !== -1
											// );
											if (
												this.state.selectedSkill === 'All Skills' ||
												personSkills.indexOf(this.state.selectedSkill) !== -1
											) {
												return (
													<ProfileBox
														key={i}
														profile={item.frontmatter}
														sanitisedName={item.parent.name}
														profileImages={data.profile_images.nodes}
													/>
												);
											}
										})}
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</Layout>
		);
	}

	getAllSkills(crmData) {
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

	getPersonSkills(person, skillCrmData) {
		var skills;
		for (var i = 0; i < skillCrmData.length; i++) {
			if (skillCrmData[i].fullName === person.name) {
				skills = skillCrmData[i].skills.advancedSkills.concat(
					skillCrmData[i].skills.intermediateSkills
				);
				break;
			}
		}
		return skills !== undefined ? skills : [];
	}
}

Index.propTypes = {
	data: PropTypes.object.isRequired,
};

export default Index;

export const query = graphql`
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
			}
		}
	}
`;
