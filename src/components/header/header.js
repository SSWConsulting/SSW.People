import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import posed from 'react-pose';
import SSWLogo from '-!svg-react-loader!../../images/SSWLogo.svg';
import GitHubIcon from '-!svg-react-loader!../../images/github.svg';
import InfoIcon from '-!svg-react-loader!../../images/info.svg';

// Example of a component-specific page transition
const AnimatedContainer = posed.div({
	enter: {
		y: 0,
		transition: {
			ease: 'easeInOut',
		},
	},
	exit: {
		y: '-100%',
		transition: {
			ease: 'easeInOut',
		},
	},
});

const Header = ({ title, displayActions, profileId }) => {
	return (
		<AnimatedContainer>
			<header>
				<div className="flex ml-8 lg:ml-12 mt-4 mb-6">
					<div className="flex items-center">
						<Link to="/" className="unstyled">
							<SSWLogo aria-label="logo" />
						</Link>
						<h1 className="title ml-2">Our People</h1>
					</div>
					{displayActions ? (
						<div className="action-btn-container">
							<a
								href={`https://github.com/SSWConsulting/People/blob/master/${profileId}/${profileId}.md`}
								className="action-btn-link"
							>
								<div className="action-btn-label">Edit</div>
								<GitHubIcon aria-label="logo" className="action-btn-icon" />
							</a>
							<a
								href="https://rules.ssw.com.au/make-your-site-easy-to-maintain"
								className="action-btn-link"
							>
								<div className="action-btn-label">Info</div>
								<InfoIcon aria-label="logo" className="action-btn-icon" />
							</a>
						</div>
					) : (
						<div></div>
					)}
				</div>
			</header>
		</AnimatedContainer>
	);
};

Header.propTypes = {
	title: PropTypes.string.isRequired,
	displayActions: PropTypes.bool.isRequired,
	profileId: PropTypes.string,
};

export default Header;
