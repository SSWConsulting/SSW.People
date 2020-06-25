import PropTypes from 'prop-types';
import React, { useState } from 'react';
import Layout from '../components/layout';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import YoutubePlaylist from '../components/youtube-playlist/youtube-playlist';
import Contact from '../components/contact/contact';
import PlayAudio from '../components/play-audio/play-audio';
import GitHubContributionCalendar from '../components/github-contribution-calendar/github-contribution-calendar';
import EventList from '../components/event-list/event-list';
import Quote from '../components/quote/quote';
import SocialLinks from '../components/social-links/social-links';
import SkillsList from '../components/skills-list/skills-list';
import { isChinaBuild } from '../helpers/chinaHelper';

config.autoAddCss = false;

const Person = ({
  pageContext,
  pageContext: {
    breadcrumb: { crumbs },
  },
}) => {
  const frontmatter = pageContext.data.frontmatter || {};
  // If Build for China, clean the html of blocked resources
  const profileHtml = pageContext.data.html || {};
  const profileImage = pageContext.data.profileImage;
  const sketchImage = pageContext.data.sketchImage;
  const profileAudio = pageContext.data.audio;
  const [hover, setHover] = useState(false);
  const crmData = pageContext.data.dataCRM || null;

  let personName = '';
  let firstNameOrNickname = '';
  if (crmData) {
    personName = crmData.nickname
      ? `${crmData.fullName} (${crmData.nickname})`
      : crmData.fullName;
    firstNameOrNickname = crmData.nickname
      ? crmData.nickname
      : crmData.fullName.split(' ')[0];
  }

  return (
    <>
      <Layout
        crumbs={crumbs}
        crumbLabel={personName}
        pageTitle={crmData && personName}
        displayActions={true}
        profileId={pageContext.slug}
      >
        <div className="flex flex-wrap mb-5 person-content">
          <div className="sm:w-full lg:w-1/4 xl:w-1/6">
            {!!profileImage && (
              <>
                <div className="person-description md:hidden w-full my-auto print-hidden">
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
                            ? sketchImage.src
                            : profileImage.src
                        }
                        alt="Profile"
                      />
                    </div>
                    {profileAudio ? (
                      <PlayAudio
                        hasAnimation={true}
                        audioSrc={profileAudio.src}
                      />
                    ) : (
                      ''
                    )}
                    <div className="mt-4 hidden md:block lg:hidden w-full">
                      <SocialLinks crmData={crmData} />
                    </div>
                  </div>
                  <div className="w-full p-2 lg:hidden print-show">
                    <div className="mb-4 w-full hidden md:block lg:hidden print-show">
                      <h1 className="inline">{personName}</h1>
                      <h4 className="mb-0">
                        {frontmatter.role}
                        {!!crmData && crmData.location && (
                          <span className="ml-2">
                            <FontAwesomeIcon icon={faMapMarkerAlt} />{' '}
                            {crmData.location}
                          </span>
                        )}
                      </h4>

                      {!!frontmatter.qualifications && (
                        <div>
                          <strong>{frontmatter.qualifications}</strong>
                        </div>
                      )}

                      <hr />
                      <div>
                        <SkillsList crmData={crmData} />
                      </div>
                    </div>

                    {frontmatter.quote && (
                      <div className="w-full quoteblock">
                        <Quote
                          quote={frontmatter.quote}
                          author={
                            frontmatter.quoteAuthor
                              ? frontmatter.quoteAuthor
                              : personName
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
            <div className="flex person-favor flex-row lg:flex-col md:hidden lg:block print-hidden">
              {frontmatter.quote && (
                <div className="hidden print-hidden w-1/2 pr-2 lg:pr-0 lg:w-full lg:block quoteblock">
                  <Quote
                    quote={frontmatter.quote}
                    author={
                      frontmatter.quoteAuthor
                        ? frontmatter.quoteAuthor
                        : personName
                    }
                  />
                </div>
              )}
              <div className="block md:hidden lg:block w-full print-hidden">
                <SocialLinks crmData={crmData} />
              </div>
            </div>
          </div>
          <div className="sm:w-full lg:w-3/4 xl:w-5/6 print-full-width">
            <div className="person-content-wrap ml-4">
              <h1 className="hidden print-hidden lg:inline">{personName}</h1>
              <h4 className="hidden print-hidden lg:block mb-0">
                {frontmatter.role}
                {!!crmData && crmData.location && (
                  <span className="ml-2">
                    <FontAwesomeIcon icon={faMapMarkerAlt} /> {crmData.location}
                  </span>
                )}
              </h4>
              {!!frontmatter.qualifications && (
                <strong className="hidden print-hidden lg:block">
                  {frontmatter.qualifications}
                </strong>
              )}
              <hr />
              <div className="block md:hidden print-hidden lg:block">
                <SkillsList crmData={crmData} />
              </div>
              <div
                className="profile-content"
                dangerouslySetInnerHTML={{
                  __html: profileHtml,
                }}
              />
              {!isChinaBuild && crmData && crmData.youTubePlayListId && (
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
                firstNameOrNickname={firstNameOrNickname}
                fullName={crmData && crmData.fullName}
              />
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

Person.propTypes = {
  data: PropTypes.object,
  pageContext: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

export default Person;
