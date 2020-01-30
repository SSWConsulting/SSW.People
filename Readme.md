# SSW.People

v2 of the EmployeePages. No more SharePoint, idea is to prove the implementation for Rules v2

This is a Gatsby generated site pulling data from:
- [SSW Profile Repo](https://github.com/SSWConsulting/People)
- [Sophie Bot's API](https://sswsophie.com)

## Getting Started

### Required Tools
- Install nodejs via https://nodejs.org/en/ (required versions: ^8.10.0 or ^10.13.0 or >=11.10.1)
- Install yarn via https://yarnpkg.com/lang/en/docs/install/ (Optional)

### Getting ready for development
- Clone the repo from https://github.com/SSWConsulting/people.ssw.com.au
- Run *yarn* (or *npm install*) to install packages
- Create environment files (.env.development and .env.production) and fill out the values for the following keys:
```
SOPHIE_API_URL=
SOPHIE_AUTHORIZATION=
SOPHIE_TENANT=
VERSION_DEPLOYED=
```

### Development
1. Branch off master for your PBI
2. Run *yarn build* (or *npm run-script build*) (.env.production is required for this step)
3. Do your work
4. Run the site in development mode by *yarn develop* (or *npm run-script develop*) (.env.development is required for this step)
5. Commit code and push
6. Raise a PR
7. Get it merged!

### Definition of Done

- Code Compiles
- Check the Acceptance Criteria.
- Code is squash-merged to master via a pull request that was approved by a 2nd developer.
- Another team member agrees it’s ready for Production.
- Pushed to Production.
- Use @Mention (**OR** Send email) to notify Product Owner/PBI stakeholder that PBI is done (be sure to include screenshots/done video as proof) 

> <As per rule: [Done - Do you go beyond 'Done' and follow a 'Definition of Done'](https://rules.ssw.com.au/done-do-you-go-beyond-done-and-follow-a-definition-of-done)?>

### Branches
- There are two main branches for this repo: **Master** is the main 'dev' branch, **Release** is the 'production' one
- Always create a new branch for your PBIs 
- Always delete your branch once your PR has been merged

### Running a Production Build
- After merging **master**, Azure DevOps automatically builds and deploys the **master** build to the **staging** site: https://sydiisp01.sydney.ssw.com.au/people/
  
- After merging **release**, Azure DevOps automatically builds and deploys the **release** build to the **production** site: https://www.ssw.com.au/people

> Note: people.ssw.com.au is the old URL for the production site

### People profiles repository

> People profiles repository lives here: https://github.com/SSWConsulting/People
- Sample Profile: 
  - Staging: https://sydiisp01.sydney.ssw.com.au/people/bob-northwind
  - Production: https://www.ssw.com.au/people/bob-northwind

Merging changes to **master** on this repo will trigger:
- a build/release of the **master** branch in Staging (https://sydiisp01.sydney.ssw.com.au/people/)
- a build/release of the **release** branch Production (https://www.ssw.com.au/people)
