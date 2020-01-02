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

### Running a Production Build
- After merging master, Azure DevOps automatically builds and deploys the master build to the production site: https://people.ssw.com.au/
