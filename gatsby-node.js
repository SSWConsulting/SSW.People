const crypto = require('crypto');
const path = require('path');
const DirectoryNamedWebpackPlugin = require('directory-named-webpack-plugin');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const chinaHelper = require('./src/helpers/chinaHelper');
const { SkillSort } = require('./src/helpers/skillSort');
const { getViewDataFromCRM, getUsersSkills } = require('./src/helpers/CRMApi');
const appInsights = require('applicationinsights');
const fs = require('fs');
const siteconfig = require('./site-config');
const matter = require('gray-matter');

const environment = process.env.NODE_ENV;
const appInsightsConnectionString =
  process.env.APPLICATIONINSIGHTS_CONNECTION_STRING;
if (!appInsightsConnectionString) {
  // eslint-disable-next-line no-console
  console.warn(
    'Missing APPLICATIONINSIGHTS_CONNECTION_STRING, this build will not be logged to Application Insights'
  );
} else if (environment === 'development') {
  /* eslint-disable no-console */
  console.info('Application Insights is disabled in development mode');
} else {
  // Log build time stats to appInsights
  const config = appInsights
    .setup(appInsightsConnectionString)
    .setAutoCollectConsole(true, true); // Enable logging of console.xxx

  const client = appInsights.defaultClient;

  // Add a telemetry initializer if needed
  client.addTelemetryProcessor((envelope, contextObjects) => {
    envelope.tags[appInsights.defaultClient.context.keys.cloudRole] =
      'GatsbyBuildProcess';
  });

  config.start();
}

let assetsManifest = {};
const alumniPrefix = siteconfig.alumniPrefix;
const profileChineseTag = '-Chinese';

exports.onCreateWebpackConfig = ({ stage, loaders, getConfig, actions }) => {
  const config = getConfig();
  //Fix thrid party module needing window as per https://www.gatsbyjs.com/docs/debugging-html-builds/#fixing-third-party-modules
  if (stage === 'build-html') {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /react-lazy-youtube/,
            use: loaders.null(),
          },
        ],
      },
      resolve: {
        alias: {
          path: require.resolve('path-browserify'),
        },
        fallback: {
          fs: false,
        },
      },
    });
  }

  if (stage.startsWith('develop') && config.resolve) {
    config.resolve.alias = {
      ...config.resolve.alias,
    };
  }

  actions.setWebpackConfig({
    plugins: [
      new WebpackAssetsManifest({
        assets: assetsManifest, // mutates object with entries
        merge: true,
      }),
    ],
    resolve: {
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
      fallback: {
        fs: false,
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer/'),
        util: require.resolve('util/'),
        assert: require.resolve('assert/'),
        http: require.resolve('stream-http/'),
        url: require.resolve('url/'),
        https: require.resolve('https-browserify/'),
        os: require.resolve('os-browserify/'),
        zlib: require.resolve('browserify-zlib'),
      },
      plugins: [
        new DirectoryNamedWebpackPlugin({
          exclude: /node_modules/,
        }),
      ],
    },
  });
};

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = `
    type SitePage implements Node @dontInfer {
      path: String!
    }
    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
    }
    type Frontmatter {
      id: String
      name: String
      qualifications: String
      quote: String
      quoteAuthor: String
      role: String
      jobTitle: String
      alternativeUrl: String
    }
  `;
  createTypes(typeDefs);
};

const loadSampleData = (crmData) => {
  try {
    let rawdata = fs.readFileSync('SampleProfileCRMData.json');
    let sampleData = JSON.parse(rawdata);
    sampleData.forEach((user) => {
      if (user.userId) {
        crmData.push(user);
      }
    });
  } catch (err) {
    // if error, then we don't add anything
  }
};

exports.sourceNodes = async ({
  actions,
  createNodeId,
  createContentDigest,
}) => {
  const { createNode } = actions;

  {
    const res = await fetch('https://www.ssw.com.au/api/get-megamenu');
    const menuData = await res.json();

    menuData?.menuGroups.forEach((group) => {
      const node = {
        id: createNodeId(`megamenugroup-${group.name}`),
        parent: null,
        children: [],
        internal: {
          type: 'MegaMenuGroup',
          contentDigest: createContentDigest(group),
        },
        ...group,
      };

      createNode(node);
    });
  }

  const crmDataResult = await getViewDataFromCRM();
  let skills = await getUsersSkills();
  skills = skills
    .map((user) => {
      return {
        service: user.technology,
        marketingPage: user.marketingPage,
        marketingPageUrl: user.marketingPageUrl,
        highlightskill: user.highlightskill,
      };
    })
    .filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.service === value.service)
    );

  // load data for the sample profile
  loadSampleData(crmDataResult);

  crmDataResult.map((user) => {
    const userNode = {
      id: user.userId,
      parent: '__SOURCE__',
      internal: {
        type: 'CrmDataCollection',
      },
      children: [],

      slug: user.fullName
        ? user.fullName.replace(' ', '-')
        : `${user.firstName}-${user.lastName}`,
      fullName: user.fullName
        ? user.fullName
        : `${user.firstName} ${user.lastName}`,
      emailAddress: user.emailAddress || '',
      location: user.defaultSite ? user.defaultSite : 'Others',
      jobTitle: user.jobTitle.replace(/(SSW)(?! TV)/g, '') || '',
      role: user.role || '',
      billingRate: user.billableRate || '',
      skills: {
        intermediateSkills: user.skills
          .filter((s) => s.experienceLevel === 'Intermediate')
          .sort(SkillSort)
          .map((s) => {
            return {
              service: s.technology,
              marketingPageUrl: s.marketingPageUrl,
            };
          }),
        advancedSkills: user.skills
          .filter((s) => s.experienceLevel === 'Advanced')
          .sort(SkillSort)
          .map((s) => {
            return {
              service: s.technology,
              marketingPageUrl: s.marketingPageUrl,
            };
          }),
      },
      isActive: user.isActive,
      nickname: user.nickname || '',
      blogUrl: user.blogUrl || '',
      facebookUrl: user.facebookUrl || '',
      skypeUsername: user.skypeUsername || '',
      linkedInUrl: user.linkedInUrl || '',
      twitterUsername: user.twitterUsername || '',
      gitHubUrl: user.gitHubUrl || '',
      youTubePlayListId: user.youTubePlayListId || '',
      publicPhotoAlbumUrl: user.publicPhotoAlbumUrl || '',
    };

    // Get content digest of node. (Required field)
    const contentDigest = crypto
      .createHash('md5')
      .update(JSON.stringify(userNode))
      .digest('hex');
    // add it to userNode
    userNode.internal.contentDigest = contentDigest;

    // Create node with the gatsby createNode() API
    createNode(userNode);
  });

  skills.map((service) => {
    createNode({
      service,
      id: createNodeId(service.service),
      internal: {
        type: 'SkillUrls',
        contentDigest: createContentDigest(service),
      },
    });
  });
};

exports.createPages = async function ({ actions, graphql }) {
  const { data } = await graphql(`
    query {
      allSkillUrls {
        nodes {
          id
          service {
            service
            marketingPage
            marketingPageUrl
            highlightskill
          }
        }
      }
      people: allMarkdownRemark {
        nodes {
          parent {
            ... on File {
              name
            }
          }
          frontmatter {
            id
            name
            qualifications
            quote
            quoteAuthor
            role
            jobTitle
          }
          html
          rawMarkdownBody
        }
      }
      peopleCRM: allCrmDataCollection {
        nodes {
          id
          isActive
          nickname
          skills {
            advancedSkills {
              service
              marketingPageUrl
            }
            intermediateSkills {
              service
              marketingPageUrl
            }
          }
          location
          jobTitle
          billingRate
          role
          emailAddress
          skypeUsername
          twitterUsername
          gitHubUrl
          youTubePlayListId
          blogUrl
          facebookUrl
          linkedInUrl
          fullName
          publicPhotoAlbumUrl
        }
      }
      peopleAudios: allFile(
        filter: {
          sourceInstanceName: { eq: "people" }
          name: { glob: "*-Audio" }
        }
      ) {
        nodes {
          name
          publicURL
        }
      }
      peopleProfileImages: allFile(
        filter: {
          sourceInstanceName: { eq: "people" }
          name: { glob: "*-Profile" }
        }
      ) {
        nodes {
          childImageSharp {
            original {
              src
            }
            parent {
              ... on File {
                name
              }
            }
          }
        }
      }
      peopleSketchImages: allFile(
        filter: {
          sourceInstanceName: { eq: "people" }
          name: { glob: "*-Sketch" }
        }
      ) {
        nodes {
          childImageSharp {
            original {
              src
            }
            parent {
              ... on File {
                name
              }
            }
          }
        }
      }
    }
  `);

  const skillUrls = data.allSkillUrls.nodes.map((node) => {
    return node;
  });

  const peopleCRM = data.peopleCRM.nodes.map((node) => {
    return node;
  });

  const peopleAudios = data.peopleAudios.nodes.map((node) => {
    return {
      src: node.publicURL,
      name: node.name.replace('-Audio', ''),
    };
  });
  const peopleProfileImages = data.peopleProfileImages.nodes.map((node) => {
    return {
      src: node.childImageSharp.original.src,
      name: node.childImageSharp.parent.name.replace('-Profile', ''),
    };
  });
  const peopleSketchImages = data.peopleSketchImages.nodes.map((node) => {
    return {
      src: node.childImageSharp.original.src,
      name: node.childImageSharp.parent.name.replace('-Sketch', ''),
    };
  });
  const people = data.people.nodes
    .filter(
      (node) =>
        node.frontmatter.id &&
        (peopleCRM.find((x) => x.id === node.frontmatter.id) ||
          node.frontmatter.id.indexOf('-') < 0)
    )
    .map((node) => {
      const crmData = peopleCRM.find((x) => x.id === node.frontmatter.id);
      const isCurrent = crmData ? crmData.isActive : false;

      const nickname = crmData ? crmData.nickname : null;

      const prefix = isCurrent ? '' : alumniPrefix.replace('/', '') + '/';
      return {
        slug: node.parent.name,
        path: prefix + node.parent.name.toLowerCase(),
        nicknamePath: nickname
          ? prefix + nickname.replace(/ /g, '-').toLowerCase()
          : '',
        frontmatter: node.frontmatter,
        dataCRM: crmData,
        dataSkillUrls: skillUrls,
        audio: peopleAudios.find(
          (x) => x.name === node.parent.name.replace(profileChineseTag, '')
        ),
        profileImage: peopleProfileImages.find(
          (x) => x.name === node.parent.name.replace(profileChineseTag, '')
        ),
        sketchImage: peopleSketchImages.find(
          (x) => x.name === node.parent.name.replace(profileChineseTag, '')
        ),
        html: node.html,
        rawMarkdown: node.rawMarkdownBody,
      };
    });

  const peoplePath = './public';

  if (!fs.existsSync(peoplePath)) {
    fs.mkdirSync(peoplePath);
  }

  const peopleList = people
    .filter((person) => !person.path.includes('alumni'))
    .map((person) => person.path);

  fs.writeFileSync(`${peoplePath}/people.json`, JSON.stringify(peopleList));

  people.forEach((person) => {
    /* eslint-disable no-console */
    console.log('Creating page for ' + person.slug);
    console.log('\tPath: ' + person.path);
    console.log('\tNickname: ' + person.nicknamePath);
    /* eslint-enable no-console */

    actions.createPage({
      path: person.path,
      component: require.resolve('./src/templates/person.js'),
      context: {
        slug: person.slug,
        originalPath: person.path,
        nicknamePath: person.nicknamePath,
        data: {
          audio: person.audio,
          profileImage: person.profileImage,
          sketchImage: person.sketchImage,
          frontmatter: person.frontmatter,
          dataCRM: person.dataCRM,
          dataSkillUrls: person.dataSkillUrls,
          html: chinaHelper.isChinaBuild
            ? chinaHelper.cleanHtml(person.html)
            : person.html,
        },
      },
    });

    // if person has a nickname (even if they are alumni), create a redirect from it
    if (person.nicknamePath && person.path !== person.nicknamePath) {
      const nicknamePath = person.nicknamePath.replace(
        alumniPrefix.replace('/', ''),
        ''
      );
      actions.createRedirect({
        fromPath: nicknamePath,
        toPath: `/${person.path}`,
        isPermanent: true,
      });
      console.log(
        'Creating redirect from ' + nicknamePath + ' to ' + person.path
      );
    }

    if (person.path.includes('alumni')) {
      return;
    }

    const filePath = `./public/${person.path}`;
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath);
    }

    const skills = [];
    skills.push(
      ...person.dataCRM.skills.intermediateSkills.map((skill) => skill.service)
    );
    skills.push(
      ...person.dataCRM.skills.advancedSkills.map((skill) => skill.service)
    );

    const sanitisedMarkdown = (input) => {
      const lines = input.split('\n');

      const filteredLines = lines.filter((line) => {
        const imgRegex = /!\[.*\](.*)/;
        const emptyLineRegex = /^\s*$/; // this gets rid of '\r' lines

        return (
          !imgRegex.test(line) &&
          !line.trim().includes('[[imgBadge]]') &&
          !line.trim().includes('[Editing profiles]') &&
          !line.trim().includes('<br/>') &&
          !line.trim().includes('---') &&
          !line.trim().startsWith('#') &&
          !emptyLineRegex.test(line) &&
          line.length !== 0
        );
      });

      var output = filteredLines.join('\n');
      return output.split('\n', 2).join('\n');
    };

    var profileData = {
      skills: skills.join(' | '),
      position: person.dataCRM.jobTitle.trim(),
      presenter: {
        name: person.dataCRM.fullName,
        peopleProfileURL: 'https://www.ssw.com.au/people/' + person.path,
      },
      about: sanitisedMarkdown(person.rawMarkdown),
    };

    fs.writeFileSync(
      `${filePath}/profile.md`,
      matter.stringify('', profileData)
    );
  });
};
