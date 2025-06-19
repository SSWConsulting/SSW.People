# NameOverride Feature Implementation Plan

## Overview
Implement a `nameOverride` field in markdown frontmatter that allows overriding the name that comes from Dynamics CRM data. This will affect how names are displayed throughout the site while preserving the original CRM data for other purposes.

## Current Name Data Flow Analysis

### 1. Data Sources
- **Primary Source**: Dynamics CRM (`crmData.fullName`, `crmData.nickname`)
- **Fallback Source**: Markdown frontmatter (`frontmatter.name`)

### 2. Current Name Variables in person.js Template
- `personName`: Display name (includes nickname in parentheses if present)
- `fullName`: Full name from CRM or frontmatter
- `firstNameOrNickname`: First name or nickname for contact forms

### 3. Components That Use Name Data
- **ProfileDescription**: Uses `personName` for main heading (H1)
- **Quote**: Uses `personName` as fallback author if no `quoteAuthor` specified
- **EventList**: Uses `fullName` as `presenterName` and `crmData.nickname` as `presenterNickname`
- **Contact**: Uses `firstNameOrNickname` for contact form personalization
- **ContactInfo**: Uses `firstNameOrNickname` for contact messaging
- **ProfilePhotoUtils/CopyProfileInformation**: Uses `fullName` for HTML template generation
- **Page Title/Breadcrumbs** (wrapPageElement): Uses `personName` for page titles and navigation

### 4. Files That Reference Names
- `/src/templates/person.js` - Main template with name logic
- `/src/components/profile-description/profile-description.js` - H1 display
- `/src/components/quote/quote.js` - Quote attribution
- `/src/components/event-list/event-list.js` - Event presenter names
- `/src/components/contact/contact.js` - Contact form
- `/src/components/contact-info/contact-info.js` - Contact messaging
- `/src/components/profile-utils/profile-photo-utils.jsx` - Profile utilities
- `/src/components/profile-utils/utils/CopyProfileInformation.jsx` - HTML template
- `/src/helpers/wrapPageElement.js` - Page titles and breadcrumbs
- `/src/pages/alumni/index.js` - Alumni page listings
- `/gatsby-node.js` - Page generation and data processing

## Implementation Plan

### Phase 1: Update GraphQL Schema and Data Processing

#### Step 1.1: Update gatsby-node.js GraphQL Query
- **File**: `/gatsby-node.js` (around line 300-350)
- **Action**: Add `nameOverride` to the frontmatter query
```javascript
frontmatter {
  id
  name
  nameOverride  // ADD THIS LINE
  qualifications
  quote
  quoteAuthor
  role
  jobTitle
}
```

#### Step 1.2: Pass nameOverride Through Page Context
- **File**: `/gatsby-node.js` (around line 450-480)
- **Action**: Ensure `nameOverride` flows through to page context via `person.frontmatter`

### Phase 2: Implement Name Override Logic

#### Step 2.1: Update Main Template Logic
- **File**: `/src/templates/person.js` (lines 30-65)
- **Action**: Modify name assignment logic to prioritize `nameOverride`

**Current Logic**:
```javascript
let personName = frontmatter.name;
let fullName = '';
let firstNameOrNickname = '';

if (crmData) {
  personName = crmData.nickname
    ? `${crmData.fullName} (${crmData.nickname})`
    : crmData.fullName;
  fullName = crmData.fullName;
  firstNameOrNickname = crmData.nickname
    ? crmData.nickname
    : crmData.fullName.split(' ')[0];
} else {
  personName = frontmatter.name ? frontmatter.name : '';
  fullName = frontmatter.name ? frontmatter.name : '';
  firstNameOrNickname = frontmatter.name
    ? frontmatter.name?.split(' ')[0]
    : '';
}
```

**New Logic**:
```javascript
// Determine the override name to use
const overrideName = frontmatter.nameOverride || null;

let personName = frontmatter.name;
let fullName = '';
let firstNameOrNickname = '';

if (crmData) {
  // Use override if provided, otherwise use CRM logic
  if (overrideName) {
    personName = overrideName;
    fullName = overrideName;
    firstNameOrNickname = overrideName.split(' ')[0];
  } else {
    personName = crmData.nickname
      ? `${crmData.fullName} (${crmData.nickname})`
      : crmData.fullName;
    fullName = crmData.fullName;
    firstNameOrNickname = crmData.nickname
      ? crmData.nickname
      : crmData.fullName.split(' ')[0];
  }
} else {
  // Fallback to frontmatter
  const fallbackName = overrideName || frontmatter.name || '';
  personName = fallbackName;
  fullName = fallbackName;
  firstNameOrNickname = fallbackName ? fallbackName.split(' ')[0] : '';
}
```

#### Step 2.2: Update Page Title/Breadcrumb Logic
- **File**: `/src/helpers/wrapPageElement.js` (lines 24-34)
- **Action**: Check for nameOverride in frontmatter before using CRM data

**Current Logic**:
```javascript
const personName = crmData
  ? crmData.nickname
    ? `${crmData.fullName} (${crmData.nickname})`
    : crmData.fullName
  : null;
```

**New Logic**:
```javascript
const frontmatter = 
  props && props.pageContext && props.pageContext.data 
    ? props.pageContext.data.frontmatter 
    : null;

const personName = frontmatter?.nameOverride 
  ? frontmatter.nameOverride
  : crmData
    ? crmData.nickname
      ? `${crmData.fullName} (${crmData.nickname})`
      : crmData.fullName
    : null;
```

### Phase 3: Update Alumni Page Logic

#### Step 3.1: Update Alumni Page Name Logic
- **File**: `/src/pages/alumni/index.js` (lines 160-165 and 195-200)
- **Action**: Add nameOverride support for alumni listings

**Current Logic**:
```javascript
fullName: !isFixedTile ? dataCRM.fullName : node.frontmatter.name,
nickname: !isFixedTile ? dataCRM.nickname : node.frontmatter.name,
```

**New Logic**:
```javascript
fullName: !isFixedTile 
  ? (node.frontmatter.nameOverride || dataCRM.fullName)
  : (node.frontmatter.nameOverride || node.frontmatter.name),
nickname: !isFixedTile 
  ? (node.frontmatter.nameOverride || dataCRM.nickname)
  : (node.frontmatter.nameOverride || node.frontmatter.name),
```

### Phase 4: Handle Event Integration

#### Step 4.1: Consider Event API Impact
- **File**: `/src/helpers/eventHelper.js`
- **Note**: Events API likely uses CRM fullName/nickname for matching
- **Decision**: Keep original CRM names for event matching to maintain API compatibility
- **Action**: Document that nameOverride affects display only, not event matching

### Phase 5: Testing Considerations

#### Step 5.1: Test Cases to Validate
1. **Person with CRM data + nameOverride**: Should display override name everywhere
2. **Person with CRM data + no nameOverride**: Should display CRM name (existing behavior)
3. **Person without CRM data + nameOverride**: Should display override name
4. **Person without CRM data + no nameOverride**: Should display frontmatter.name (existing behavior)
5. **Alumni with nameOverride**: Should display override name in alumni listings
6. **Page titles and breadcrumbs**: Should reflect override name
7. **Contact forms**: Should use override name for personalization
8. **Profile utilities**: Should use override name in generated HTML
9. **Event listings**: Should still work (using CRM data for API calls)
10. **Quote attribution**: Should use override name as fallback

#### Step 5.2: Edge Cases to Consider
1. Empty nameOverride field (should fallback to normal logic)
2. nameOverride with special characters
3. Very long nameOverride values
4. nameOverride affecting URL generation (should not affect slugs/paths)

### Phase 6: Documentation

#### Step 6.1: Update Documentation
- Document the new `nameOverride` frontmatter field
- Explain that it overrides display names but preserves CRM data for APIs
- Provide examples of usage

## Impact Summary

### Files to Modify:
1. `/gatsby-node.js` - Add nameOverride to GraphQL query
2. `/src/templates/person.js` - Main name override logic
3. `/src/helpers/wrapPageElement.js` - Page title override logic
4. `/src/pages/alumni/index.js` - Alumni listing override logic

### Components Affected (automatically via props):
- ProfileDescription
- Quote
- Contact/ContactInfo
- ProfilePhotoUtils/CopyProfileInformation

### What Won't Change:
- URL generation/slugs (still based on file names)
- Event API integration (still uses CRM data)
- Existing CRM data storage

## Implementation Priority:
1. High: Core template logic (`person.js`)
2. High: Page titles (`wrapPageElement.js`)
3. Medium: Alumni page
4. Low: Additional testing and edge cases

This implementation maintains backward compatibility while adding the flexible nameOverride feature that can be used selectively in the markdown files stored in the separate repository.
