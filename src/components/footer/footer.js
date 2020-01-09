import React from 'react';
import preval from 'preval.macro';
import moment from 'moment';

const buildTimestamp = preval`module.exports = new Date().getTime();`;

const Footer = () => {
	return (
		<footer className="w-full bg-black">
			<div className="py-2 flex">
				<div className="w-1/6" />
				<div className="w-1/6">
					Copyright © SSW 1990 - {new Date().getFullYear()}. All Rights
					Reserved.
				</div>
				<div className="w-3/6 text-right">
					<a
						className="footer-link"
						href="https://github.com/SSWConsulting/people.ssw.com.au/issues"
					>
						FEEDBACK TO SSW
					</a>
					<span className="px-2">|</span>
					<a
						className="footer-link"
						href="http://www.ssw.com.au/ssw/Standards/Forms/ConsultingOrderTermsConditions.aspx"
					>
						TERMS AND CONDITION
					</a>
					<span className="px-2">|</span>
					<a
						className="footer-link footer-facebook"
						href="https://www.facebook.com/SSW.page"
					>
						FIND US ON
					</a>
					<span className="px-2">|</span>
					<a
						className="footer-link footer-html"
						href="https://www.w3.org/html/logo/faq.html"
					>
						HTML
					</a>
				</div>
				{/* Copyright © SSW 1990 - {new Date().getFullYear()}. All Rights Reserved. */}
			</div>
			<div className="flex">
				<div className="w-1/6" />
				<div className="py-2 w-3/6 border-t border-gray-800">
					Our website is under{' '}
					<a
						className="footer-link"
						href="https://rules.ssw.com.au/WebSites/RulestoBetterWebsites-Deployment/Pages/Do-your-developers-deploy-manually.aspx"
					>
						CONSTANT CONTINUOUS DEPLOYMENT
					</a>
					. Last deployed {getLastDeployTime()} ago (Build #{' '}
					{process.env.VERSION_DEPLOYED})
				</div>
				<div className="py-2 w-1/6 border-t border-gray-800 text-right">
					Powered by{' '}
					<a
						className="footer-link"
						href="https://rules.ssw.com.au/rules-to-better-azure"
					>
						Azure
					</a>{' '}
					and{' '}
					<a
						className="footer-link"
						href="https://rules.ssw.com.au/static-site-generator"
					>
						{' '}
						GitHub
					</a>
				</div>
			</div>
		</footer>
	);
};

const getLastDeployTime = () => {
	const lastDeployDuration = moment.duration(Date.now() - buildTimestamp);
	let delta = Math.abs(lastDeployDuration) / 1000;

	const days = Math.floor(delta / 86400);
	delta -= days * 86400;

	var hours = Math.floor(delta / 3600) % 24;
	delta -= hours * 3600;

	var minutes = Math.floor(delta / 60) % 60;
	delta -= minutes * 60;

	return days != 0
		? `${days} day(s)`
		: '' + ' ' + hours != 0
		? `${hours} hour(s)`
		: '' + ' ' + minutes > 1
		? `${minutes} minutes`
		: '1 minute';
};

Footer.propTypes = {};

export default Footer;
