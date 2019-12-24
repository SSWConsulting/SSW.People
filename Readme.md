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
- Create an environment file (.env) and fill out the values for the following keys:
```
SOPHIE_API_URL=
SOPHIE_AUTHORIZATION=
SOPHIE_TENANT=
```

### Development
1. Branch off master for your PBI
2. Run *yarn build* (or *npm run-script build*)
3. Do your work
4. Commit code and push
5. Raise a PR
6. Get it merged!

### Running a Production Build
Azure DevOps does this for us but if you'd like to create the site:
- Run *yarn develop* (or *npm run-script develop*)
