const axios = require('axios');
const qs = require('qs');
const querystring = require('querystring');

const APP_ID = process.env.CRM_APP_ID;
const TENANT = process.env.CRM_TENANT;
const TENANT_ID = process.env.CRM_TENANT_ID;
const APP_SECRET = process.env.CRM_APP_SECRET;
const TOKEN_ENDPOINT = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`;
const SCOPE = process.env.CRM_SCOPE;

const getViewDataFromCRM = async () => {
  // ----------------------------------------------------------------------------------------
  //  Obtaining an Access Token
  // ----------------------------------------------------------------------------------------
  let auth = `${APP_ID}:${querystring.escape(APP_SECRET)}`;
  let encoded_auth = Buffer.from(auth).toString('base64');
  axios.defaults.headers.post['Content-Type'] =
    'application/x-www-form-urlencoded';
  axios.defaults.headers.post['Authorization'] = `Basic ${encoded_auth}`;

  const tokenPostData = {
    grant_type: 'client_credentials',
    scope: SCOPE,
  };

  let accessToken;


  const responsePost = await axios.post(TOKEN_ENDPOINT, qs.stringify(tokenPostData));

  accessToken = responsePost.data.access_token;

  let queryFilter = `?savedQuery=${process.env.CRM_VIEW_CURRENT}`;

  let crmUrl = `https://${TENANT}/api/data/v9.1`;
  let userQuery = `${crmUrl}/systemusers${queryFilter}`;

  axios.defaults.headers.get['Authorization'] = `Bearer ${accessToken}`;

  let response = await axios.get(userQuery);
  return response.data.value.map(user => {
    return {
      userId: user.systemuserid,
      fullName: user.fullName,
      emailAddress: user.internalemailaddress,
      location: 'Others',
      billingRate: user.ssw_defaultrate,
      isActive: true,
      nickname: user.nickname || '',
      blogUrl: user.ssw_blogUrl,
      facebookUrl: user.ssw_facebookurl,
      skypeUsername: user.ssw_skypeusername,
      linkedInUrl: user.ssw_linkedInUrl,
      twitterUsername: user.ssw_twitterUsername,
      gitHubUrl: user.ssw_gitHubUrl,
      youTubePlayListId: user.ssw_youTubePlayListId,
      skills: []
    }
  });
/*
  axios
    .post(TOKEN_ENDPOINT, qs.stringify(tokenPostData))
    .then(response => {
      accessToken = response.data.access_token;

      let queryFilter = `?savedQuery=${process.env.CRM_VIEW_CURRENT}`;

      let crmUrl = `https://${TENANT}/api/data/v9.1`;
      let userQuery = `${crmUrl}/systemusers${queryFilter}`;

      axios.defaults.headers.get['Authorization'] = `Bearer ${accessToken}`;
      axios
        .get(userQuery)
        .then(response => {
          //get skills
          console.log('COMMON', response.data.value[0]);
          //create json object
          return response.data.map(user => {
            return {
                userId: user.systemuserid,
                fullName: user.fullName           
            }
          });

          //console.log('COMMON', response.data.value[0]);
          // console.log('MOBILE', response.data.value[0].mobilephone);
        })
        .catch(error => {
          console.log('COMMON', error);
        });
    })
    .catch(error => {
      console.log('TOKEN', error);
    });*/
};

module.exports = { getViewDataFromCRM };
