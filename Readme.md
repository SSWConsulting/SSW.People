<img src="https://github.com/SSWConsulting/SSW.People/raw/main/_wiki/images/ssw-banner.png">

# SSW.People

v2 of the EmployeePages. No more SharePoint, idea is to prove the implementation for Rules v2

This is a Gatsby generated site pulling data from:

- [SSW Profiles GitHub Repository](https://github.com/SSWConsulting/SSW.People.Profiles)
- Dynamics CRM

## Getting Started

### Required Tools

- Install nodejs via <https://nodejs.org/en/> (LTS Version)
- Install yarn via <https://yarnpkg.com/lang/en/docs/install/> (Optional)
- Package dependencies (Windows)
  - Python 3
  - Node-gyp - see https://github.com/nodejs/node-gyp#on-windows

### Getting ready for development

- Clone the repo from <https://github.com/SSWConsulting/SSW.People>
- Run *yarn* (or *npm install*) to install packages
- Create environment files (.env.development and .env.production) and fill out the values for the following keys:
  
  ``` env
  GOOGLE_ANALYTICS=
  RECAPTCHA_KEY=
  DATA_API_URL=FALSE
  DATA_API_AUTHORIZATION=
  DATA_API_TENANT=
  YOUTUBE_API_KEY=
  VERSION_DEPLOYED=#{VERSION_DEPLOYED}
  CHINA_BUILD=FALSE
  EVENTS_API=https://www.ssw.com.au/ssw/SharePointEventsService.aspx
  CONTACT_API=/ssw/api/crm/createlead
  CRM_APP_ID=
  CRM_TENANT=
  CRM_TENANT_ID=
  CRM_APP_SECRET=
  CRM_SCOPE=
  CRM_VIEW_CURRENT=
  CRM_VIEW_PAST=
  APPINSIGHTS_INSTRUMENTATIONKEY=#{APPINSIGHTS_INSTRUMENTATIONKEY}
  REWRITES_JSON_URL=FALSE
  ```

### Development

1. Branch off main for your PBI
2. Run *yarn build* (or *npm run-script build*) (.env.production is required for this step)
3. Do your work
4. Run the site in development mode by *yarn develop* (or *npm run-script develop*) (.env.development is required for this step)
5. Commit code and push
6. Raise a PR
7. Get it merged!

### Definition of Done

- Code Compiles
- Check the Acceptance Criteria.
- Code is squash-merged to main via a pull request that was approved by a 2nd developer.
- Another team member agrees it’s ready for Production.
- Pushed to Production.
- Use @Mention (**OR** Send email) to notify Product Owner/PBI stakeholder that PBI is done (be sure to include screenshots/done video as proof) 

> <As per rule: [Done - Do you go beyond 'Done' and follow a 'Definition of Done'](https://rules.ssw.com.au/done-do-you-go-beyond-done-and-follow-a-definition-of-done)?>

### Branches

- Branching strategy is based off [Release Flow](https://docs.microsoft.com/en-us/azure/devops/learn/devops-at-microsoft/release-flow)
- **Main** is the main 'dev' branch
- **Release/xx** is the 'production' one (where xx is the Sprint number)
- Always create a new branch for your PBIs
- Always delete your branch once your PR has been merged

### Builds

- Changes made to http://github.com/SSWConsulting/SSW.People.Profiles (i.e. profile changes) trigger builds that deploy:
  - **main** to the **staging** site: <https://staging.ssw.com.au/people/>
  - latest **release/xx** to the **production** site: <https://www.ssw.com.au/people>
  
- Branching off **main** to **release/xx**, or making changes to **release/xx** will build and deploy to the **production** site: <https://www.ssw.com.au/people>

> Note: people.ssw.com.au redirects to <https://www.ssw.com.au/people>

### People profiles repository

> People profiles repository lives here: <https://github.com/SSWConsulting/SSW.People.Profiles>
>
- Sample Profile:
  - Staging: <https://staging.ssw.com.au/people/bob-northwind>
  - Production: <https://www.ssw.com.au/people/bob-northwind>

Merging changes to **main** on this repo will trigger:

- a build/release of the **main** branch in Staging (https://staging.ssw.com.au/people/)
- a build/release of the **release** branch Production (https://www.ssw.com.au/people)

[Next Step: Wiki >](https://github.com/SSWConsulting/SSW.People/wiki)

---
<img align="left" width="32" height="22" src="https://github.com/SSWConsulting/SSW.People/raw/main/_wiki/images/youtube_social_icon_red.png">

[SSW.People YouTube Channel](https://www.youtube.com/channel/UCrr5pDDM5Fnvgk4fCXfsX-A)
