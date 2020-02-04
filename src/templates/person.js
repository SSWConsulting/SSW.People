import { graphql } from 'gatsby';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import Layout from '../components/layout';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import Contact from '../components/contact/contact';
import ContactForm from '../components/contact-form/contact-form';
import Modal from 'react-modal';

config.autoAddCss = false;

const Person = ({
  data,
  pageContext: {
    breadcrumb: { crumbs },
  },
}) => {
  const person = data.people;
  const childMarkdownRemark = person.childMarkdownRemark || {};
  const frontmatter = childMarkdownRemark.frontmatter || {};
  const profileHtml = childMarkdownRemark.html || {};
  const crmData = data.crmData || {};
  const skills = crmData.skills || {};
  const intermediateSkills = skills.intermediateSkills || [];
  const advancedSkills = skills.advancedSkills || [];
  const profileImage = data.profileImage.nodes[0];

  const [displayContactForm, setdisplayContactForm] = useState(false);

  const onContactButtonClick = () => {
    setdisplayContactForm(!displayContactForm);
  };

  return (
    <Layout
      crumbs={crumbs}
      crumbLabel={frontmatter.name}
      pageTitle={
        childMarkdownRemark.frontmatter && childMarkdownRemark.frontmatter.name
      }
      displayActions={true}
      profileId={person.name}
    >
      <div className="flex flex-wrap mb-5 md:mx-2 person-content">
        <div className="sm:w-full lg:w-1/4 xl:w-1/6">
          {!!profileImage && (
            <>
              <div className="person-description lg:hidden w-full my-auto">
                <h1 className="inline">{frontmatter.name}</h1>
                <h4 className="mb-0">{frontmatter.role}</h4>
                {!!crmData.location && (
                  <h4 className="mb-0">
                    <FontAwesomeIcon icon={faMapMarkerAlt} /> {crmData.location}
                  </h4>
                )}
                {!!frontmatter.qualifications && (
                  <strong>{frontmatter.qualifications}</strong>
                )}
              </div>
              <div className="flex profile-image-quote">
                <div className="image-bg text-center">
                  <img
                    className="profile-image relative bg-cover mx-auto"
                    src={profileImage.childImageSharp.original.src}
                    alt="Profile"
                  />
                </div>
                <div className="w-full pr-2 lg:hidden quoteblock">
                  <div className="person-quote">{frontmatter.quote}</div>
                  <div className="person-quote-name">
                    {frontmatter.quote_author != ''
                      ? frontmatter.quote_author
                      : frontmatter.nickname}
                  </div>
                </div>
              </div>
            </>
          )}
          <div className="flex person-favor flex-row lg:flex-col">
            <div className="hidden w-1/2 pr-2 lg:pr-0 lg:w-full lg:block quoteblock">
              <div className="person-quote">{frontmatter.quote}</div>
              <div className="person-quote-name">
                {frontmatter.quote_author != ''
                  ? frontmatter.quote_author
                  : frontmatter.nickname}
              </div>
            </div>
            <div className="favor-content w-full">
              <ul className="favor-list">
                {crmData.emailAddress != '' && (
                  <li id="email" className="social">
                    <a href={'mailto:' + crmData.emailAddress}>Email</a>
                  </li>
                )}
                {frontmatter.blog != '' && (
                  <li id="blog" className="social">
                    <a target="_blank" rel="noopener noreferrer" href={frontmatter.blog}>
                      Blog
                    </a>
                  </li>
                )}
                {frontmatter.facebook != '' && (
                  <li id="facebook" className="social">
                    <a target="_blank" rel="noopener noreferrer" href={'https://www.facebook.com/' + frontmatter.facebook}>
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
                    <a target="_blank" rel="noopener noreferrer" href={'https://www.linkedin.com/in/' + frontmatter.linkedin}>
                      LinkedIn
                    </a>
                  </li>
                )}
                {frontmatter.twitter != '' && (
                  <li id="twitter" className="social">
                    <a target="_blank" rel="noopener noreferrer" href={'https://www.twitter.com/' + frontmatter.twitter}>
                      Twitter
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
        <div className="sm:w-full lg:w-3/4 xl:w-5/6">
          <div className="person-description md:pl-4">
            <h1 className="hidden lg:inline">{frontmatter.name}</h1>
            <h4 className="hidden lg:block mb-0">
              {frontmatter.role}
              {!!crmData.location && (
                <span className="ml-2">
                  <FontAwesomeIcon icon={faMapMarkerAlt} /> {crmData.location}
                </span>
              )}
            </h4>
            {!!frontmatter.qualifications && (
              <strong className="hidden lg:block">
                {frontmatter.qualifications}
              </strong>
            )}
            {((advancedSkills && !!advancedSkills.length) ||
              (intermediateSkills && !!intermediateSkills.length)) && (
              <>
                <hr />

                <h4 className="text-ssw-red mb-0">Skills:</h4>
                <span>
                  {advancedSkills.map((skill, i, arr) => (
                    <strong key={`advancedSkill-${i}`}>
                      {skill}
                      {(i !== arr.length - 1 ||
                        (i === arr.length - 1 &&
                          intermediateSkills.length > 0)) && (
                        <span className="skill-separator"> | </span>
                      )}
                    </strong>
                  ))}
                  {intermediateSkills.map((skill, i, arr) => (
                    <span key={`intermediateSkill-${i}`}>
                      {skill}
                      {i !== arr.length - 1 && (
                        <span className="skill-separator"> | </span>
                      )}
                    </span>
                  ))}
                </span>
                <hr />
              </>
            )}

            <div
              className="profile-content"
              dangerouslySetInnerHTML={{
                __html: profileHtml,
              }}
            />
            <hr />
            <Contact
              onClick={() => onContactButtonClick()}
              profileName={frontmatter.nickname}
            />
            <Modal
              isOpen={displayContactForm}
              contentLabel="Contact Form"
              className="modal"
            >
              <ContactForm
                profileName={frontmatter.name}
                onClose={() => setdisplayContactForm(false)}
              />
            </Modal>
          </div>
        </div>
      </div>
    </Layout>
  );
};

Person.propTypes = {
  data: PropTypes.object.isRequired,
  pageContext: PropTypes.object.isRequired,
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
          quote_author
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
