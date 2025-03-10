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
    <link
      key="svg-favicon"
      rel="icon"
      type="image/svg+xml"
      href="/people/favicon.svg"
    />,
    <link
      key="png-favicon-48"
      rel="icon"
      type="image/png"
      sizes="48x48"
      href="/people/favicon-48x48.png"
    />,
    <link
      key="png-favicon-96"
      rel="icon"
      type="image/png"
      sizes="96x96"
      href="/people/favicon-96x96.png"
    />,
    <link key="ico-favicon" rel="shortcut icon" href="/people/favicon.ico" />,
  ]);
};

// Page Transitions
export const wrapPageElement = wrapPageElementWithTransition;
