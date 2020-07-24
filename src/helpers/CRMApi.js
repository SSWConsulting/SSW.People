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

  const responsePost = await axios.post(
    TOKEN_ENDPOINT,
    qs.stringify(tokenPostData)
  );

  accessToken = responsePost.data.access_token;

  let queryFilter = `?savedQuery=${process.env.CRM_VIEW_CURRENT}`;

  let crmUrl = `https://${TENANT}/api/data/v9.1`;
  let userQuery = `${crmUrl}/systemusers${queryFilter}`;

  axios.defaults.headers.get['Authorization'] = `Bearer ${accessToken}`;

  //get skills
  const responseSkills = await axios.get(`${crmUrl}/ssw_skills`);
  const skills = responseSkills.data.value;
  //get users skilss
  const responseUsersSkills = await axios.get(`${crmUrl}/ssw_userskills`);
  const usersSkills = responseUsersSkills.data.value.map(us => {
    let skill = skills.find(s => s.ssw_skillid === us._ssw_skillid_value);
    return {
      userId: us._ssw_systemuserid_value,
      experienceLevel: us.ssw_experiencelevel ? 'Advanced' : 'Intermediate',
      sortOrder: us.ssw_sortorder || null,
      technology: skill ? skill.ssw_name : '',
    };
  });
  //get sites
  const responseSites = await axios.get(`${crmUrl}/sites`);
  const sites = responseSites.data.value;

  const response = await axios.get(userQuery);
  return response.data.value.map(user => {
    return {
      userId: user.systemuserid,
      fullName: user.fullname,
      emailAddress: user.internalemailaddress,
      location: user._siteid_value
        ? sites.find(s => s.siteid === user._siteid_value).name
        : null,
      billingRate: user.ssw_defaultrate,
      isActive: true,
      nickname: user.nickname || '',
      blogUrl: user.ssw_blogurl || '',
      facebookUrl: user.ssw_facebookurl || '',
      skypeUsername: user.ssw_skypeusername || '',
      linkedInUrl: user.ssw_linkedinurl || '',
      twitterUsername: user.ssw_twitterusername || '',
      gitHubUrl: user.ssw_githuburl || '',
      youTubePlayListId: user.ssw_youtubeplaylistid || '',
      publicPhotoAlbumUrl: user.ssw_publicphotoalbumurl || '',
      skills: usersSkills.filter(us => us.userId === user.systemuserid),
    };
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
