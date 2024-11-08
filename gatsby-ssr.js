import React from 'react';
import { renderToString } from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';
import AppProvider from 'store/provider';
import wrapPageElementWithTransition from 'helpers/wrapPageElement';
import '@fontsource-variable/inter';
import interWoff2 from '@fontsource-variable/inter/files/inter-latin-wght-normal.woff2?url';

export const replaceRenderer = ({
  bodyComponent,
  replaceBodyHTMLString,
  setHeadComponents,
}) => {
  // React Context in SSR/build
  const ConnectedBody = () => <AppProvider>{bodyComponent}</AppProvider>;
  replaceBodyHTMLString(renderToString(<ConnectedBody />));

  // Add styled-components in SSR/build
  const sheet = new ServerStyleSheet();
  renderToString(sheet.collectStyles(<ConnectedBody />));
  const styleElement = sheet.getStyleElement();
  setHeadComponents(styleElement);
};

export const onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    <link
      rel="preload"
      as="font"
      type="font/woff2"
      href={interWoff2}
      crossOrigin="anonymous"
      key="interPreload"
    />,
  ]);
};

// Page Transitions
export const wrapPageElement = wrapPageElementWithTransition;
