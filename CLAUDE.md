# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **yarn 4** (Berry). Node 20 LTS.

- `yarn dev` — Gatsby develop server (requires `.env.development`)
- `yarn build` — generates favicons, then `gatsby build --prefix-paths --log-pages` (requires `.env.production`)
- `yarn devbuild` — same as build, without prefix paths / page log
- `yarn serve` / `yarn ssr` — serve a built site (`ssr` = build then serve)
- `yarn lint` — eslint with `--max-warnings=0`
- `yarn test` — runs `ava **/*.test.js --verbose` (currently only `scripts/lighthouse.test.js`)
- `yarn format` — prettier on `src/**/*.js`

`.env.development` and `.env.production` are required for `dev` and `build` respectively. Variables are listed in `.env.template`; values are stored in the SSW Keeper record.

## Architecture

This is a **Gatsby 5** site that generates one page per SSW employee by merging three data sources at build time:

1. **Markdown profiles** sourced via `gatsby-source-git` from [SSW.People.Profiles](https://github.com/SSWConsulting/SSW.People.Profiles) (`*-*/**` and `badges/**` patterns). The `frontmatter.id` is the join key.
2. **Dynamics CRM** — `src/helpers/CRMApi.js` calls Microsoft Dataverse with an OAuth client-credentials flow (`CRM_*` env vars) for employees, sites, and skills. `SampleProfileCRMData.json` is appended for the sample profile.
3. **YouTube Data API** — playlist items per user (`YOUTUBE_API_KEY`).

Page generation lives entirely in `gatsby-node.js`:

- `sourceNodes` fetches the SSW megamenu, CRM data, skills, and YouTube playlists, then creates `CrmDataCollection`, `SkillUrls`, `MegaMenuGroup`, and `PeopleYoutubePlaylists` nodes.
- `createPages` joins markdown profiles to CRM rows by `frontmatter.id`, routes active employees to `/<slug>` and inactive ones to `/alumni/<slug>` (alumni prefix from `site-config.js`), creates redirects from nicknames, and writes a sanitised `profile.md` per person plus `public/people.json` (used downstream).
- The single page template is `src/templates/person.js`. There is no per-person source file.

`site-config.js` holds non-secret site metadata (path prefix, locations/role ordering, profiles repo URL).

### China build

When `CHINA_BUILD=TRUE`, `pathPrefix` is suffixed with `-cn` and `chinaHelper.cleanHtml` strips blocked third-party resources from rendered profile HTML. Most code paths branch on `chinaHelper.isChinaBuild`.

### Webpack quirks

`gatsby-node.js#onCreateWebpackConfig` adds Node polyfills (`stream-browserify`, `buffer`, `util`, etc.), aliases `path` to `path-browserify`, and uses `directory-named-webpack-plugin` so that `import Foo from 'components/foo'` resolves to `components/foo/foo.js`. `react-lazy-youtube` is null-loaded during `build-html` because it touches `window`.

### Dev-only rules proxy

`onCreateDevServer` exposes `/__rules/people-latest-rules.json` proxying `https://www.ssw.com.au/rules/people-latest-rules.json` to avoid browser CORS in dev. The `RulesWidget` component fetches this URL.

### Pinned dependencies (do not bump blindly)

See `packageComments` in `package.json`:
- `gatsby-remark-custom-blocks` ^3.2.0 — locked for compatibility with `gatsby-transformer-remark` ^3.2.0
- `gatsby-transformer-remark` ^3.2.0 — locked because of the above
- `favicons` 6.2.2 — see jantimon/favicons-webpack-plugin#309
- `gatsby-remark-relative-images` ^0.3.0 — newer versions break image handling
- `sharp` resolution pinned to `0.33.2`

## Conventions

- Single quotes, prettier-enforced (`'prettier/prettier': 'warn'`, `quotes: ['warn', 'single']`).
- Lint is zero-warnings: `eslint --max-warnings=0`. `no-console` is `warn`, so any new `console.*` call will fail CI unless wrapped in `eslint-disable`.
- `prop-types` is `warn` — keep PropTypes on new components.
- Branching: branch off `main` per the Readme; `release/xx` is the production branch and merges to `main` deploy to staging.
