import React from 'react';
import GitHubCalendar from 'react-github-calendar';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';

const GitHubContributionCalendar = ({ githubUserName }) => {
  return (
    <>
      <hr />
      <h4 className="text-ssw-red mb-0">GitHub Contributions</h4>
      <div className="mx-3">
        <GitHubCalendar
          username={githubUserName}
          blockSize={9}
          blockMargin={3}
          fontSize={10}
        >
          <ReactTooltip delayShow={50} html />
        </GitHubCalendar>
      </div>
    </>
  );
};

GitHubContributionCalendar.propTypes = {
  githubUserName: PropTypes.string.isRequired,
};

export default GitHubContributionCalendar;
