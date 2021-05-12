import React from 'react';
import PropTypes from 'prop-types';
import { isChinaBuild } from 'helpers/chinaHelper';
import { siteUrlCn } from '../site-config.js';

export default function HTML(props) {
  return (
    <html lang="en" {...props.htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        {props.headComponents}
        <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            if(!${isChinaBuild})
            {
              axios.get('https://api.userinfo.io/userinfos')
              .then(function (response) {
                if (response.status === 200) {
                  if (response.data.country.code === 'CN') {
                    var page = location.pathname.replace('/people/','/people-cn/')
                    window.location.replace('${siteUrlCn}' + page);
                  }
                }
              })
            }
`,
          }}
        />
      </head>
      <body {...props.bodyAttributes}>
        {props.preBodyComponents}
        <div
          key={'body'}
          id="___gatsby"
          dangerouslySetInnerHTML={{ __html: props.body }}
        />
        {props.postBodyComponents}
      </body>
    </html>
  );
}

HTML.propTypes = {
  htmlAttributes: PropTypes.object,
  headComponents: PropTypes.array,
  bodyAttributes: PropTypes.object,
  preBodyComponents: PropTypes.array,
  body: PropTypes.string,
  postBodyComponents: PropTypes.array,
};
