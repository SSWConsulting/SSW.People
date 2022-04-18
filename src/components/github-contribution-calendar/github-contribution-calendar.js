import React from 'react';
import GitHubCalendar from 'react-github-calendar';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';

const GitHubContributionCalendar = ({ githubUrl }) => {
  let userName = githubUrl.split('/');
  return (
    <>
      <hr />
      <h2>GitHub Contributions</h2>
      <div className="mx-3">
        <GitHubCalendar
          username={userName[userName.length - 1]}
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
  githubUrl: PropTypes.string.isRequired,
};

export default GitHubContributionCalendar;
