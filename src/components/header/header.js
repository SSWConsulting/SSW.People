import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import posed from 'react-pose';
import SSWLogo from '-!svg-react-loader!../../images/SSWLogo.svg';

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

const Header = ({ title }) => (
	<AnimatedContainer>
		<header>
			<div className="flex flex-wrap md:flex-no-wrap items-center justify-between max-w-6xl mx-auto p-4 md:p-8">
				<div className="flex items-center">
					<Link to="/">
						<SSWLogo aria-label="logo" />
					</Link>
					<h1 className="title ml-2">Our People</h1>
				</div>
			</div>
		</header>
	</AnimatedContainer>
);

Header.propTypes = {
	title: PropTypes.string.isRequired,
};

export default Header;
