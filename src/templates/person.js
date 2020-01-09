import { graphql } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';
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
	const profileImage = data.profileImage.nodes[0];

	return (
		<Layout displayActions={true} profileId={person.name}>
			<div className="flex flex-wrap mb-5 person-content">
				<div className="sm:w-full md:w-full lg:w-1/4 xl:w-1/6 profileHeaderWidth">
					{profileImage != undefined && (
						<div className="flex">
							<div className="image-bg text-center w-1/2 mx-auto">
								<img
									className="profile-image relative bg-cover mx-auto"
									src={profileImage.childImageSharp.original.src}
									alt="Profile"
								/>
							</div>
							<div className="person-description lg:hidden xl:hidden w-1/2 my-auto">
								<h1>{frontmatter.name}</h1>
							</div>
						</div>
					)}
					<div className="flex person-favor flex-row lg:flex-col">
						<div className="w-1/2 pr-2  lg:pr-0 lg:w-full">
							<div className="person-quote">{frontmatter.quote}</div>
							<br />
							<div className="person-quote-name">{frontmatter.nickname}</div>
						</div>
						<div className="favor-content w-1/2 lg:w-full">
							<ul className="favor-list">
								{crmData.emailAddress != '' && (
									<li id="email" className="social">
										<a href={'mailto:' + crmData.emailAddress}>
											Contact {frontmatter.nickname}
										</a>
									</li>
								)}
								{frontmatter.facebook != '' && (
									<li id="facebook" className="social">
										<a
											href={'https://www.facebook.com/' + frontmatter.facebook}
										>
											Facebook
										</a>
									</li>
								)}
								{frontmatter.skype != '' && (
									<li id="skype" className="social">
										<a href={'skype:' + frontmatter.skype + '?call'}>Skype</a>
									</li>
								)}
								{frontmatter.linkedin != '' && (
									<li id="linkedin" className="social">
										<a
											href={
												'https://www.linkedin.com/in/' + frontmatter.linkedin
											}
										>
											LinkedIn
										</a>
									</li>
								)}
								{frontmatter.twitter != '' && (
									<li id="twitter" className="social">
										<a href={'https://www.twitter.com/' + frontmatter.twitter}>
											Twitter
										</a>
									</li>
								)}
							</ul>
						</div>
					</div>
				</div>
				<div className="sm:w-full md:w-full lg:w-3/4 xl:5/6 descriptionwidth">
					<div className="person-description">
						<h1 className="hidden lg:inline xl:inline">{frontmatter.name}</h1>
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
							<dd>{crmData.location}</dd>
						</dl>
						<dl>
							<dt>Skills:</dt>
							{advancedSkills.map((skill, i) => (
								<dd key={`a${i}`}> {skill};</dd>
							))}
							{intermediateSkills.map((skill, i) => (
								<dd key={`i${i}`}> {skill};</dd>
							))}
						</dl>

						<div
							className="profile-content"
							dangerouslySetInnerHTML={{
								__html: profileHtml,
							}}
						/>
					</div>
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
