import React from 'react';

const Footer = () => {
	return (
        <footer className="w-full bg-gray-800 text-gray-300 text-xs">
            © Copyright SSW 1990-2019. All Rights Reserved.
            <hr/>
            Our website is under <a href="https://rules.ssw.com.au/WebSites/RulestoBetterWebsites-Deployment/Pages/Do-your-developers-deploy-manually.aspx">CONSTANT CONTINUOUS DEPLOYMENT</a>. 
            The lastest deployment is xxx
        </footer>
    );
}

Footer.propTypes = {
};

export default Footer;
