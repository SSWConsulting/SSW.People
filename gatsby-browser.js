import React from 'react';
import AppProvider from 'store/provider';
import wrapPageElementWithTransition from 'helpers/wrapPageElement';
import { isChinaBuild } from 'helpers/chinaHelper';
import axios from 'axios';

// React Context in Browser
// eslint-disable-next-line react/prop-types
export const wrapRootElement = ({ element }) => {
  return <AppProvider>{element}</AppProvider>;
};

// Page Transitions
export const wrapPageElement = wrapPageElementWithTransition;

const DetectCountry = async location => {
  const IP_DETECT_URL = 'https://api.userinfo.io/userinfos';
  const ipInfo = await axios.get(IP_DETECT_URL);
  if (ipInfo.status === 200) {
    if (ipInfo.data.country.code === 'CN') {
      window.location = `https://peoplecn.ssw.com.au${location.pathname.replace(
        '/people/',
        '/people-cn/'
      )}`;
    }
  }
};

export const onRouteUpdate = ({ location }) => {
  if (!isChinaBuild) {
    DetectCountry(location);
  }
};
