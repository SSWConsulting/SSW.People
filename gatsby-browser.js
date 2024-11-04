import wrapPageElementWithTransition from 'helpers/wrapPageElement';
import React from 'react';
import AppProvider from 'store/provider';
// import { isChinaBuild } from 'helpers/chinaHelper';
// import axios from 'axios';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { SeverityLevel } from '@microsoft/applicationinsights-web';
import '@fontsource/inter';
// import { siteUrlCn } from './site-config.js';

const environment = process.env.NODE_ENV;
const appInsightsConnectionString =
  process.env.APPLICATIONINSIGHTS_CONNECTION_STRING;
if (!appInsightsConnectionString) {
  /* eslint-disable no-console */
  console.warn('APPLICATIONINSIGHTS_CONNECTION_STRING is not set');
} else if (environment === 'development') {
  /* eslint-disable no-console */
  console.info('Application Insights is disabled in development mode');
} else {
  try {
    const appInsights = new ApplicationInsights({
      config: {
        connectionString: appInsightsConnectionString,
        disableCorrelationHeaders: false,
      },
    });

    appInsights.loadAppInsights();
    appInsights.addTelemetryInitializer((item) => {
      item.tags['ai.cloud.role'] = 'SSW.People-StaticClientPage';
      item.data = item.data || {};
      item.data.environment = environment;
    });

    // Additional telemetry for unhandled errors and promise rejections
    window.addEventListener('error', (event) => {
      appInsights.trackException({
        error: event.error,
        severityLevel: SeverityLevel.Error,
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      appInsights.trackException({
        error: event.reason,
        severityLevel: SeverityLevel.Error,
      });
    });

    appInsights.trackPageView(); // Manually call trackPageView to establish the current user/session/pageview
  } catch (error) {
    /* eslint-disable no-console */
    console.error('Error initializing Application Insights', error);
  }
}

// React Context in Browser

export const wrapRootElement = ({ element }) => {
  return <AppProvider>{element}</AppProvider>;
};

// Page Transitions
export const wrapPageElement = wrapPageElementWithTransition;

// See issue for context - https://github.com/SSWConsulting/SSW.People/issues/451

// const DetectCountry = async location => {
//   const IP_DETECT_URL = 'https://api.userinfo.io/userinfos';
//   const ipInfo = await axios.get(IP_DETECT_URL);
//   if (ipInfo.status === 200) {
//     if (ipInfo.data.country.code === 'CN') {
//       window.location = `${siteUrlCn}${location.pathname.replace(
//         '/people/',
//         '/people-cn/'
//       )}`;
//     }
//   }
// };

// export const onRouteUpdate = ({ location }) => {
//   if (!isChinaBuild) {
//     DetectCountry(location);
//   }
// };
