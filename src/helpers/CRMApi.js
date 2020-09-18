const axios = require('axios');
const qs = require('qs');
const querystring = require('querystring');

const APP_ID = process.env.CRM_APP_ID;
const TENANT = process.env.CRM_TENANT;
const TENANT_ID = process.env.CRM_TENANT_ID;
const APP_SECRET = process.env.CRM_APP_SECRET;
const TOKEN_ENDPOINT = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`;
const SCOPE = process.env.CRM_SCOPE;

const crmUrl = `https://${TENANT}/api/data/v9.1`;

const getViewDataFromCRM = async () => {
  const accessToken = await getToken();

  axios.defaults.headers.get['Authorization'] = `Bearer ${accessToken}`;
  axios.defaults.headers.common['Prefer'] =
    'odata.include-annotations=OData.Community.Display.V1.FormattedValue';

  const usersSkills = await getUsersSkills();

  const sites = await getSites();

  const currentEmployees = await getEmployees(sites, usersSkills, true);
  const pastEmployees = await getEmployees(sites, usersSkills, false);
  return currentEmployees.concat(pastEmployees);
};

const getSites = async () => {
  //get sites
  const responseSites = await axios.get(`${crmUrl}/sites`);
  return responseSites.data.value;
};
const getUsersSkills = async () => {
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
  return usersSkills;
};

const getToken = async () => {
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

  const responsePost = await axios.post(
    TOKEN_ENDPOINT,
    qs.stringify(tokenPostData)
  );

  return responsePost.data.access_token;
};

const getEmployees = async (sites, usersSkills, current) => {
  let viewId = current
    ? process.env.CRM_VIEW_CURRENT
    : process.env.CRM_VIEW_PAST;

  let queryFilter = `?savedQuery=${viewId}`;
  let userQuery = `${crmUrl}/systemusers${queryFilter}`;
  const response = await axios.get(userQuery);
  const employees = convertToSimpleFormat(
    response.data.value,
    sites,
    usersSkills,
    current
  );
  return employees;
};

const convertToSimpleFormat = (data, sites, usersSkills, current) => {
  return data.map(user => {
    return {
      userId: user.systemuserid,
      fullName: user.fullname,
      emailAddress: user.internalemailaddress,
      defaultSite: user._siteid_value
        ? sites.find(s => s.siteid === user._siteid_value).name
        : null,
      jobTitle: user.title || '',
      role:
        user['ssw_profilecategory@OData.Community.Display.V1.FormattedValue'] ||
        '',
      billableRate: user.ssw_defaultrate.toString(),
      isActive: current,
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
};

module.exports = { getViewDataFromCRM };
