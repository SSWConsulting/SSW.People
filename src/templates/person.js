import { graphql } from 'gatsby';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import Layout from '../components/layout';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import YoutubePlaylist from '../components/youtube-playlist/youtube-playlist';
import Contact from '../components/contact/contact';
import ContactForm from '../components/contact-form/contact-form';
import Modal from 'react-modal';
import PlayAudio from '../components/play-audio/play-audio';
import GitHubContributionCalendar from '../components/github-contribution-calendar/github-contribution-calendar';
import EventList from '../components/event-list/event-list';

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
  const profileImage = data.profileImage.nodes[0];
  const sketchImage = data.sketchImage.nodes[0];
  const profileAudio = data.profileAudio.nodes[0];
  const [displayContactForm, setdisplayContactForm] = useState(false);
  const [hover, setHover] = useState(false);
  const crmData = data.crmData || null;

  let intermediateSkills = [];
  let advancedSkills = [];
  let personName = '';
  let firstNameOrNickname = '';
  let encodedEmailAddress = '';

  const encodeEmail = emailAddress => {
    let encodedString = '';

    for (var i = 0; i < emailAddress.length; i++) {
      encodedString += emailAddress.charCodeAt(i).toString(16);
    }
    return encodedString;
  };

  if (crmData) {
    intermediateSkills = crmData.skills
      ? crmData.skills.intermediateSkills
      : [];
    advancedSkills = crmData.skills ? crmData.skills.advancedSkills : [];
    personName = crmData.nickname
      ? `${crmData.fullName} (${crmData.nickname})`
      : crmData.fullName;
    firstNameOrNickname = crmData.nickname
      ? crmData.nickname
      : crmData.fullName.split(' ')[0];
    encodedEmailAddress = encodeEmail(crmData.emailAddress);
  }

  const onContactButtonClick = () => {
    setdisplayContactForm(!displayContactForm);
  };

  const decodeEmail = encodedEmail => {
    let email = '';

    if (encodedEmail !== undefined) {
      // go through and decode the email address
      for (var i = 0; i < encodedEmail.length; i += 2) {
        // holds each letter (2 digits)
        const letter = encodedEmail.charAt(i) + encodedEmail.charAt(i + 1);

        // build the real email address
        email += String.fromCharCode(parseInt(letter, 16));
      }
    }
    return email;
  };

  const sendEmail = e => {
    e.preventDefault();
    window.location.href = 'mailTo:' + decodeEmail(encodedEmailAddress);
  };

  return (
    <>
      <Layout
        crumbs={crumbs}
        crumbLabel={personName}
        pageTitle={crmData && personName}
        displayActions={true}
        profileId={crmData && crmData.id}
      >
        <div className="flex flex-wrap mb-5 md:mx-2 person-content">
          <div className="sm:w-full lg:w-1/4 xl:w-1/6">
            {!!profileImage && (
              <>
                <div className="person-description lg:hidden w-full my-auto">
                  <h1 className="inline">{personName}</h1>
                  <h4 className="mb-0">{frontmatter.role}</h4>
                  {!!crmData && crmData.location && (
                    <h4 className="mb-0">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                      {crmData.location}
                    </h4>
                  )}
                  {!!frontmatter.qualifications && (
                    <strong>{frontmatter.qualifications}</strong>
                  )}
                </div>
                <div className="flex profile-image-quote">
                  <div>
                    <div
                      className="image-bg text-center"
                      onMouseEnter={() => {
                        setHover(true);
                      }}
                      onMouseLeave={() => {
                        setHover(false);
                      }}
                    >
                      <img
                        className="profile-image relative bg-cover mx-auto"
                        src={
                          hover && !!sketchImage
                            ? sketchImage.childImageSharp.original.src
                            : profileImage.childImageSharp.original.src
                        }
                        alt="Profile"
                      />
                    </div>
                    {profileAudio ? (
                      <PlayAudio
                        hasAnimation={true}
                        audioSrc={profileAudio.publicURL}
                      />
                    ) : (
                      ''
                    )}
                  </div>
                  {frontmatter.quote && (
                    <div className="w-full pr-2 lg:hidden quoteblock">
                      <div className="person-quote">{frontmatter.quote}</div>
                      <div className="person-quote-name">
                        {frontmatter.quoteAuthor
                          ? frontmatter.quoteAuthor
                          : personName}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
            <div className="flex person-favor flex-row lg:flex-col">
              {frontmatter.quote && (
                <div className="hidden w-1/2 pr-2 lg:pr-0 lg:w-full lg:block quoteblock">
                  <div className="person-quote">{frontmatter.quote}</div>
                  <div className="person-quote-name">
                    {frontmatter.quoteAuthor
                      ? frontmatter.quoteAuthor
                      : personName}
                  </div>
                </div>
              )}
              {crmData && (
                <div className="favor-content w-full">
                  <ul className="favor-list">
                    {crmData.emailAddress && (
                      <li id="email" className="social">
                        <a
                          href={'#0'}
                          onClick={event => {
                            sendEmail(event);
                          }}
                        >
                          {' '}
                          Email{' '}
                        </a>
                      </li>
                    )}
                    {crmData.blogUrl && (
                      <li id="blog" className="social">
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={crmData.blogUrl}
                        >
                          Blog
                        </a>
                      </li>
                    )}
                    {crmData.facebookUrl && (
                      <li id="facebook" className="social">
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={crmData.facebookUrl}
                        >
                          Facebook
                        </a>
                      </li>
                    )}
                    {crmData.skypeUsername && (
                      <li id="skype" className="social">
                        <a href={`skype:${crmData.skypeUsername}?call`}>
                          Skype
                        </a>
                      </li>
                    )}
                    {crmData.linkedInUrl && (
                      <li id="linkedin" className="social">
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={crmData.linkedInUrl}
                        >
                          LinkedIn
                        </a>
                      </li>
                    )}
                    {crmData.twitterUsername && (
                      <li id="twitter" className="social">
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={`https://www.twitter.com/${crmData.twitterUsername}`}
                        >
                          Twitter
                        </a>
                      </li>
                    )}
                    {crmData.gitHubUrl && (
                      <li id="github" className="social">
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={crmData.gitHubUrl}
                        >
                          GitHub
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div className="sm:w-full lg:w-3/4 xl:w-5/6">
            <div className="person-description md:pl-4">
              <h1 className="hidden lg:inline">{personName}</h1>
              <h4 className="hidden lg:block mb-0">
                {frontmatter.role}
                {!!crmData && crmData.location && (
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
              <hr />
              {((advancedSkills && !!advancedSkills.length) ||
                (intermediateSkills && !!intermediateSkills.length)) && (
                <>
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
              {crmData && crmData.youTubePlayListId && (
                <>
                  <hr />
                  <YoutubePlaylist
                    youtubePlayListId={crmData.youTubePlayListId}
                  />
                </>
              )}
              {crmData && crmData.gitHubUrl && (
                <GitHubContributionCalendar githubUrl={crmData.gitHubUrl} />
              )}
              {crmData && (
                <>
                  <hr />
                  <EventList
                    presenterName={crmData.fullName}
                    presenterNickname={crmData.nickname}
                  />
                </>
              )}
              <Contact
                onClick={() => onContactButtonClick()}
                profileName={firstNameOrNickname}
              />
              <Modal
                isOpen={displayContactForm}
                contentLabel="Contact Form"
                className="modal"
              >
                <ContactForm
                  profileName={crmData && crmData.fullName}
                  onClose={() => setdisplayContactForm(false)}
                />
              </Modal>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

Person.propTypes = {
  data: PropTypes.object.isRequired,
  pageContext: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

export default Person;

export const query = graphql`
  query(
    $id: String!
    $profileImage: String!
    $sketchImage: String!
    $audio: String!
  ) {
    people: file(
      sourceInstanceName: { eq: "people" }
      childMarkdownRemark: { frontmatter: { id: { eq: $id } } }
    ) {
      name
      childMarkdownRemark {
        frontmatter {
          id
          role
          category
          qualifications
          quote
          quoteAuthor
        }
        html
      }
    }
    sketchImage: allFile(
      filter: {
        sourceInstanceName: { eq: "people" }
        name: { glob: $sketchImage }
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
    profileImage: allFile(
      filter: {
        sourceInstanceName: { eq: "people" }
        name: { glob: $profileImage }
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
    profileAudio: allFile(
      filter: { sourceInstanceName: { eq: "people" }, name: { glob: $audio } }
    ) {
      nodes {
        name
        publicURL
      }
    }
    crmData: crmDataCollection(id: { eq: $id }) {
      skills {
        intermediateSkills
        advancedSkills
      }
      location
      emailAddress
      skypeUsername
      twitterUsername
      gitHubUrl
      youTubePlayListId
      isActive
      blogUrl
      facebookUrl
      linkedInUrl
      id
      fullName
      nickname
    }
  }
`;
