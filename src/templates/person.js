import '@fortawesome/fontawesome-svg-core/styles.css';

import React, { useState, useEffect } from 'react';

import ActionButtons from '../components/action-buttons/action-buttons';
import Contact from '../components/contact/contact';
import EventList from '../components/event-list/event-list';
import GitHubContributionCalendar from '../components/github-contribution-calendar/github-contribution-calendar';
import PlayAudio from '../components/play-audio/play-audio';
import ProfileDescription from '../components/profile-description/profile-description';
import ProfilePhoto from '../components/profile-photo/profile-photo';
import PropTypes from 'prop-types';
import Quote from '../components/quote/quote';
import SkillsList from '../components/skills-list/skills-list';
import SocialLinks from '../components/social-links/social-links';
import { RulesWidget } from 'ssw.rules.widget';
import YoutubePlaylist from '../components/youtube-playlist/youtube-playlist';
import { config } from '@fortawesome/fontawesome-svg-core';
import { isChinaBuild } from '../helpers/chinaHelper';
import ProfilePhotoUtils from '../components/profile-utils/profile-photo-utils';

config.autoAddCss = false;

const Person = ({ pageContext }) => {
  const frontmatter = pageContext.data.frontmatter || {};
  // If Build for China, clean the html of blocked resources
  const profileHtml = pageContext.data.html || {};
  const profileImage = pageContext.data.profileImage;
  const sketchImage = pageContext.data.sketchImage;
  const profileAudio = pageContext.data.audio;
  const crmData = pageContext.data.dataCRM || null;

  let isActive = false;
  let personName = frontmatter.name;
  let fullName = '';
  let firstNameOrNickname = '';
  let jobTitle = frontmatter.role;
  let githubUsername = '';
  let billingRate = 0;
  let slug = pageContext.nicknamePath
    ? pageContext.nicknamePath
    : pageContext.originalPath;
  if (crmData) {
    isActive = crmData.isActive;
    personName = crmData.nickname
      ? `${crmData.fullName} (${crmData.nickname})`
      : crmData.fullName;
    fullName = crmData.fullName;
    firstNameOrNickname = crmData.nickname
      ? crmData.nickname
      : crmData.fullName.split(' ')[0];
    jobTitle = crmData.jobTitle.replace(/Mr/, '').replace(/Ms/, '')
      ? crmData.jobTitle
      : frontmatter.jobTitle;
    githubUsername = crmData.gitHubUrl
      ? crmData.gitHubUrl.split('/').pop()
      : '';
    billingRate = crmData.billingRate;
  } else {
    personName = frontmatter.name ? frontmatter.name : '';
    fullName = frontmatter.name ? frontmatter.name : '';
    firstNameOrNickname = frontmatter.name
      ? frontmatter.name?.split(' ')[0]
      : '';
    jobTitle = frontmatter.jobTitle;
  }

  const [WidgetComponent, setWidgetComponent] = useState();

  const initWidget = () => {
    // Removing for the moment as it is not working as intended
    return (
      <RulesWidget
        githubToken={''}
        appInsightsToken={
          process.env?.RULESWIDGET_APPINSIGHTS_INSTRUMENTATIONKEY
        }
        ruleEditor={githubUsername}
        ruleCount={5}
        rulesUrl="https://www.ssw.com.au/rules/"
        userRulesUrl="/rules/user/?author="
      />
    );
  };

  useEffect(() => {
    githubUsername && setWidgetComponent(initWidget());
  }, []);

  const quote = (
    <Quote
      quote={frontmatter.quote}
      author={frontmatter.quoteAuthor ? frontmatter.quoteAuthor : personName}
    />
  );

  const profileDescription = (
    <>
      <ProfileDescription
        personName={personName}
        jobTitle={jobTitle}
        location={crmData?.location}
        qualifications={frontmatter.qualifications}
      >
        <ActionButtons profileId={pageContext.slug}></ActionButtons>
      </ProfileDescription>
    </>
  );

  const skillsList = <SkillsList crmData={crmData} />;
  const socialLinks = <SocialLinks crmData={crmData} />;

  return (
    <>
      <div className="flex flex-wrap mb-5 person-content">
        <div className="w-full lg:w-1/4 xl:w-1/6 print-full-width">
          <div className="person-description md:hidden w-full my-auto print-hidden pb-0 md:pb-4">
            {profileDescription}
          </div>
          <div className="flex md:justify-center justify-around">
            <div>
              <ProfilePhoto
                profileImage={profileImage}
                sketchImage={sketchImage}
              >
                <ProfilePhotoUtils
                  profile={{ profileImage, fullName, slug, billingRate }}
                />
              </ProfilePhoto>
              {profileAudio ? (
                <PlayAudio hasAnimation={true} audioSrc={profileAudio.src} />
              ) : (
                ''
              )}
              <div className="mt-4 hidden md:block lg:hidden w-full">
                <SocialLinks crmData={crmData} />
              </div>
            </div>
            <div className="lg:hidden print-show px-2 md:p-2">
              <div className="mb-4 w-full hidden md:block lg:hidden print-show">
                {profileDescription}
                <hr />
                <div>{skillsList}</div>
              </div>

              <div className="w-full md:hidden">{socialLinks}</div>
              {frontmatter.quote && (
                <div className="hidden w-full md:block quoteblock print-hidden">
                  <div className="object-center">{quote}</div>
                </div>
              )}
            </div>
          </div>
          <div className="flex person-favor flex-wrap lg:flex-col md:hidden lg:block print-show">
            {frontmatter.quote && (
              <div className="hidden w-1/2 pr-2 lg:pr-0 lg:w-full lg:block quoteblock print-hidden">
                {quote}
              </div>
            )}
            <div className="md:block hidden print-hidden">{socialLinks}</div>
            <div className="block md:hidden w-full print-show">{quote}</div>
            <div className="hidden justify-center md:block ">
              {githubUsername && WidgetComponent}
            </div>
          </div>
        </div>
        <div className="sm:w-full lg:w-3/4 xl:w-5/6 print-full-width">
          <div className="person-content-wrap mx-4">
            <div className="hidden lg:block print-hidden">
              {profileDescription}
            </div>
            <hr className="print-hidden" />
            <div className="block md:hidden print-hidden lg:block">
              {skillsList}
            </div>
            <div
              className="profile-content print-full-width"
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
            <hr className="md:hidden" />
            <div className="lg:hidden">{githubUsername && WidgetComponent}</div>
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
              alumni={!isActive}
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
