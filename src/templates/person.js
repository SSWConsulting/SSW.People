import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { faMapMarkerAlt, faDownload } from '@fortawesome/free-solid-svg-icons';
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
import SketchPlaceholder from '../images/ssw-employee-profile-placeholder-sketch.jpg';
import ProfilePlaceholder from '../images/ssw-employee-profile-placeholder-profile.jpg';

config.autoAddCss = false;

const Person = ({ pageContext }) => {
  const frontmatter = pageContext.data.frontmatter || {};
  // If Build for China, clean the html of blocked resources
  const profileHtml = pageContext.data.html || {};
  const profileImage = pageContext.data.profileImage;
  const sketchImage = pageContext.data.sketchImage;
  const profileAudio = pageContext.data.audio;
  const [hover, setHover] = useState(false);
  const crmData = pageContext.data.dataCRM || null;

  let personName = frontmatter.name;
  let fullName = '';
  let firstNameOrNickname = '';
  let jobTitle = frontmatter.role;
  if (crmData) {
    personName = crmData.nickname
      ? `${crmData.fullName} (${crmData.nickname})`
      : crmData.fullName;
    fullName = crmData.fullName;
    firstNameOrNickname = crmData.nickname
      ? crmData.nickname
      : crmData.fullName.split(' ')[0];
    jobTitle = crmData.jobTitle ? crmData.jobTitle : frontmatter.jobTitle;
  } else {
    personName = frontmatter.name ? frontmatter.name : '';
    fullName = frontmatter.name ? frontmatter.name : '';
    firstNameOrNickname = frontmatter.name
      ? frontmatter.name?.split(' ')[0]
      : '';
    jobTitle = frontmatter.jobTitle;
  }

  return (
    <>
      <div className="flex flex-wrap mb-5 person-content">
        <div className="sm:w-full lg:w-1/4 xl:w-1/6">
          {
            <>
              <div className="person-description md:hidden w-full my-auto print-hidden">
                <h1 className="inline">{personName}</h1>
                <h4 className="mb-0">{jobTitle}</h4>
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
                    className="image-bg relative text-center"
                    onMouseEnter={() => {
                      setHover(true);
                    }}
                    onMouseLeave={() => {
                      setHover(false);
                    }}
                  >
                    <a
                      className="download-image"
                      href={
                        profileImage ? profileImage.src : ProfilePlaceholder
                      }
                      download={`${fullName.replace(' ', '-')}-Profile`}
                    >
                      <img
                        className="profile-image bg-cover mx-auto"
                        src={
                          hover
                            ? sketchImage
                              ? sketchImage.src
                              : SketchPlaceholder
                            : profileImage
                            ? profileImage.src
                            : ProfilePlaceholder
                        }
                        alt="Profile"
                      />
                      <div className="absolute bottom-0 left-0">
                        <FontAwesomeIcon icon={faDownload} className="m-4" />
                      </div>
                    </a>
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
                <div className="w-full lg:hidden print-show px-2 md:p-2">
                  <div className="mb-4 w-full hidden md:block lg:hidden print-show">
                    <h1 className="inline">{personName}</h1>
                    <h4 className="mb-0">
                      {jobTitle}
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

                  <div className="w-full md:hidden">
                    <SocialLinks crmData={crmData} />
                  </div>
                  {frontmatter.quote && (
                    <div className="hidden w-full md:block quoteblock">
                      <div className="object-center">
                        <Quote
                          quote={frontmatter.quote}
                          author={
                            frontmatter.quoteAuthor
                              ? frontmatter.quoteAuthor
                              : personName
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          }
          <div className="flex person-favor flex-row lg:flex-col md:hidden lg:block ">
            {frontmatter.quote && (
              <div className="hidden print-hidden w-1/2 pr-2 lg:pr-0 lg:w-full lg:block quoteblock print-hidden">
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
            <div className="block md:hidden lg:block hidden print-hidden">
              <SocialLinks crmData={crmData} />
            </div>
            <div className="block md:hidden w-full print-show">
              <Quote
                quote={frontmatter.quote}
                author={
                  frontmatter.quoteAuthor ? frontmatter.quoteAuthor : personName
                }
              />
            </div>
          </div>
        </div>
        <div className="sm:w-full lg:w-3/4 xl:w-5/6 print-full-width">
          <div className="person-content-wrap ml-4">
            <h1 className="hidden print-hidden lg:inline">{personName}</h1>
            <h4 className="hidden print-hidden lg:block mb-0">
              {jobTitle}
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
            <hr className="print-hidden" />
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
                  presenterName={fullName}
                  presenterNickname={crmData.nickname}
                />
              </>
            )}
            <Contact
              firstNameOrNickname={firstNameOrNickname}
              fullName={fullName}
            />
          </div>
        </div>
      </div>
    </>
  );
};

Person.propTypes = {
  data: PropTypes.object,
  pageContext: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

export default Person;
