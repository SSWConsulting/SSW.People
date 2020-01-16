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
    <Layout
      pageTitle={
        childMarkdownRemark.frontmatter && childMarkdownRemark.frontmatter.name
      }
      displayActions={true}
      profileId={person.name}
    >
      <div className="flex flex-wrap mb-5 person-content">
        <div className="sm:w-full md:w-full lg:w-1/4 xl:w-1/6 profileHeaderWidth">
          {profileImage != undefined && (
            <>
              <div className="person-description lg:hidden xl:hidden w-full my-auto">
                <h1 className="inline">{frontmatter.name}</h1>
                <h4>{frontmatter.role}</h4>
              </div>
              <div className="flex profile-image-quote">
                <div className="image-bg text-center">
                  <img
                    className="profile-image relative bg-cover mx-auto"
                    src={profileImage.childImageSharp.original.src}
                    alt="Profile"
                  />
                </div>
                <div className="w-full pr-2 lg:hidden lg:hidden quoteblock">
                  <div className="person-quote">{frontmatter.quote}</div>
                  <br />
                  <div className="person-quote-name">
                    {frontmatter.nickname}
                  </div>
                </div>
              </div>
            </>
          )}
          <div className="flex person-favor flex-row lg:flex-col">
            <div className="hidden w-1/2 pr-2  lg:pr-0 lg:w-full lg:block quoteblock">
              <div className="person-quote">{frontmatter.quote}</div>
              <br />
              <div className="person-quote-name">{frontmatter.nickname}</div>
            </div>
            <div className="favor-content w-full lg:w-full">
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
            <h4 className="hidden lg:block xl:block">{frontmatter.role}</h4>
            {!!frontmatter.qualifications && (
              <dl>
                <dt>Qualification:</dt>
                <dd>{frontmatter.qualifications}</dd>
              </dl>
            )}
            {!!crmData.location && (
              <dl>
                <dt>Location:</dt>
                <dd>{crmData.location}</dd>
              </dl>
            )}
            {((advancedSkills && advancedSkills.length) ||
              (intermediateSkills && intermediateSkills.length)) && (
              <dl>
                <dt>Skills:</dt>
                {advancedSkills.map((skill, i, arr) => (
                  <dd key={`advancedSkill-${i}`}>
                    {skill}
                    {i !== arr.length - 1 && (
                      <span className="skill-separator"> | </span>
                    )}
                  </dd>
                ))}
                {intermediateSkills.map((skill, i, arr) => (
                  <dd key={`intermediateSkill-${i}`}>
                    {skill}
                    {i !== arr.length - 1 && (
                      <span className="skill-separator"> | </span>
                    )}
                  </dd>
                ))}
              </dl>
            )}

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
