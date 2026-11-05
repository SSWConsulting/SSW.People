// Tooltip text for each badge, keyed by its file name (without extension) in
// SSW.People.Profiles/badges. A new badge without an entry falls back to the
// author's caption from the profile markdown - see badgeHelper.js.
const badgeNames = {
  'Automation-Control4': 'Control4',
  'Automation-KNX': 'KNX',
  Awards_Sessionize_Most_Active_Speaker2023:
    'Sessionize Most Active Speaker 2023',
  'Business-Inrule': 'InRule',
  'Business-itil': 'ITIL',
  'Business-microsoft-azure-b2c': 'Azure AD B2C',
  'Business-microsoft-azure-devops': 'Azure DevOps',
  'Business-microsoft-azure-iot': 'Azure IoT',
  'Business-microsoft-azure-machinelearning': 'Azure Machine Learning',
  'Business-microsoft-azure': 'Microsoft Azure',
  'Business-microsoft-dynamics-powerapps': 'Power Apps',
  'Business-microsoft-dynamics-powerbi': 'Power BI',
  'Business-microsoft-dynamics': 'Dynamics 365',
  'Business-microsoft-office365-exchange': 'Exchange Online',
  'Business-microsoft-office365-onedrive': 'OneDrive',
  'Business-microsoft-office365-sharepoint': 'SharePoint',
  'Business-microsoft-office365-teams': 'Microsoft Teams',
  'Business-microsoft-office365': 'Microsoft 365',
  'Business-scrum': 'Scrum',
  'Business-zendesk': 'Zendesk',
  'CPA-Australia': 'CPA Australia',
  'Certification-Cisco-ccda': 'Cisco Certified Design Associate (CCDA)',
  'Certification-Cisco-ccdp': 'Cisco Certified Design Professional (CCDP)',
  'Certification-Cisco-ccna': 'Cisco Certified Network Associate (CCNA)',
  'Certification-Cisco-ccnp': 'Cisco Certified Network Professional (CCNP)',
  'Certification-ITIL-Foundation': 'ITIL Foundation',
  'Certification-MCSD-App-Builder': 'MCSD: App Builder',
  'Certification-aws-cloud-practitioner-foundational':
    'AWS Certified Cloud Practitioner',
  'Certification-github-admin': 'GitHub Administration',
  'Certification-github-agentic-ai-developer': 'GitHub Agentic AI Developer',
  'Certification-github-copilot': 'GitHub Copilot',
  'Certification-google-ads-display': 'Google Ads Display Certification',
  'Certification-google-ads-mobile': 'Google Ads Mobile Certification',
  'Certification-google-ads-search': 'Google Ads Search Certification',
  'Certification-google-ads-video': 'Google Ads Video Certification',
  'Certification-google-analytics-individual':
    'Google Analytics Individual Qualification',
  'Certification-google-award-ads-display': 'Google Ads Display Certification',
  'Certification-google-award-ads-fundamentals':
    'Google Ads Fundamentals Certification',
  'Certification-google-award-ads-mobile': 'Google Ads Mobile Certification',
  'Certification-google-award-ads-search': 'Google Ads Search Certification',
  'Certification-google-award-ads-shopping':
    'Google Shopping Ads Certification',
  'Certification-google-award-ads-video': 'Google Ads Video Certification',
  'Certification-google-digital-sales': 'Google Digital Sales Certification',
  'Certification-google-shopping': 'Google Shopping Ads Certification',
  'Certification-microsoft-azure-administrator-associate':
    'Microsoft Certified: Azure Administrator Associate',
  'Certification-microsoft-azure-ai-apps-and-agents-developer-associate':
    'Microsoft Certified: Azure AI Apps and Agents Developer Associate',
  'Certification-microsoft-azure-ai-engineer-associate':
    'Microsoft Certified: Azure AI Engineer Associate',
  'Certification-microsoft-azure-ai-fundamentals':
    'Microsoft Certified: Azure AI Fundamentals',
  'Certification-microsoft-azure-data-engineer-associate':
    'Microsoft Certified: Azure Data Engineer Associate',
  'Certification-microsoft-azure-data-scientist-associate':
    'Microsoft Certified: Azure Data Scientist Associate',
  'Certification-microsoft-azure-database-administrator-associate':
    'Microsoft Certified: Azure Database Administrator Associate',
  'Certification-microsoft-azure-developer-associate':
    'Microsoft Certified: Azure Developer Associate',
  'Certification-microsoft-azure-devops-engineer-expert':
    'Microsoft Certified: DevOps Engineer Expert',
  'Certification-microsoft-azure-fundamentals':
    'Microsoft Certified: Azure Fundamentals',
  'Certification-microsoft-azure-network-engineer':
    'Microsoft Certified: Azure Network Engineer Associate',
  'Certification-microsoft-azure-security-engineer':
    'Microsoft Certified: Azure Security Engineer Associate',
  'Certification-microsoft-azure-security-operations-analyst':
    'Microsoft Certified: Security Operations Analyst Associate',
  'Certification-microsoft-azure-solutions-architect-expert':
    'Microsoft Certified: Azure Solutions Architect Expert',
  'Certification-microsoft-azure-virtual-desktop':
    'Microsoft Certified: Azure Virtual Desktop Specialty',
  'Certification-microsoft-certified-fundamentals':
    'Microsoft Certified: Fundamentals',
  'Certification-microsoft-cosmos':
    'Microsoft Certified: Azure Cosmos DB Developer Specialty',
  'Certification-microsoft-developer-alm':
    'MCSD: Application Lifecycle Management',
  'Certification-microsoft-developer-app-builder': 'MCSD: App Builder',
  'Certification-microsoft-developer-sharepoint':
    'MCSD: SharePoint Applications',
  'Certification-microsoft-developer-webapps': 'MCSD: Web Applications',
  'Certification-microsoft-fabric-analytics-engineer-associate':
    'Microsoft Certified: Fabric Analytics Engineer Associate',
  'Certification-microsoft-fabric-data-engineer-associate':
    'Microsoft Certified: Fabric Data Engineer Associate',
  'Certification-microsoft-mvp': 'Microsoft Most Valuable Professional (MVP)',
  'Certification-microsoft-power-bi-data-analyst-associate':
    'Microsoft Certified: Power BI Data Analyst Associate',
  'Certification-microsoft-power-platform-app-maker-associate':
    'Microsoft Certified: Power Platform App Maker Associate',
  'Certification-microsoft-power-platform-developer-associate':
    'Microsoft Certified: Power Platform Developer Associate',
  'Certification-microsoft-power-platform-functional-consultant-associate':
    'Microsoft Certified: Power Platform Functional Consultant Associate',
  'Certification-microsoft-power-platform-fundamentals':
    'Microsoft Certified: Power Platform Fundamentals',
  'Certification-microsoft-power-platform-solutions-architect-expert':
    'Microsoft Certified: Power Platform Solution Architect Expert',
  'Certification-microsoft-professional': 'Microsoft Certified Professional',
  'Certification-microsoft-regional-director': 'Microsoft Regional Director',
  'Certification-poty-finalist-education':
    'Microsoft 2023 Partner of the Year Finalist: Education Award',
  'Certification-poty-finalist-education-shrunk':
    'Microsoft 2023 Partner of the Year Finalist: Education Award',
  'Certification-poty-finalist-inclusion-shrunk':
    'Microsoft 2023 Partner of the Year Finalist: Inclusion Changemaker Award',
  'Certification-scrumalliance-developer-1': 'Certified Scrum Developer (CSD)',
  'Certification-scrumalliance-developer-2':
    'Advanced Certified Scrum Developer (A-CSD)',
  'Certification-scrumalliance-master': 'Certified ScrumMaster (CSM)',
  'Certification-scrumalliance-master-2':
    'Advanced Certified ScrumMaster (A-CSM)',
  'Certification-scrumalliance-master-3':
    'Certified Scrum Professional - ScrumMaster (CSP-SM)',
  'Certification-scrumalliance-owner-1': 'Certified Scrum Product Owner (CSPO)',
  'Certification-scrumalliance-owner-2':
    'Advanced Certified Scrum Product Owner (A-CSPO)',
  'Certification-scrumalliance-owner-3':
    'Certified Scrum Professional - Product Owner (CSP-PO)',
  'Certification-scrumalliance-trainer': 'Certified Scrum Trainer (CST)',
  'Certification-scrumorg-developer': 'Professional Scrum Developer (PSD)',
  'Certification-scrumorg-master-1': 'Professional Scrum Master I (PSM I)',
  'Certification-scrumorg-master-2': 'Professional Scrum Master II (PSM II)',
  'Certification-scrumorg-product-owner':
    'Professional Scrum Product Owner I (PSPO I)',
  'Certification-scrumorg-product-owner-adv':
    'Professional Scrum Product Owner II (PSPO II)',
  'Certification-scrumorg-trainer': 'Professional Scrum Trainer (PST)',
  'Certification-scrumorg-ux': 'Professional Scrum with UX (PSU)',
  'Chartered_Accountants_Australia_and_New_Zealand_logo.svg':
    'Chartered Accountants Australia and New Zealand',
  Claude: 'Claude',
  'Designer-adobe-aftereffects': 'Adobe After Effects',
  'Designer-adobe-illustrator': 'Adobe Illustrator',
  'Designer-adobe-indesign': 'Adobe InDesign',
  'Designer-adobe-photoshop': 'Adobe Photoshop',
  'Designer-adobe-premiere': 'Adobe Premiere Pro',
  'Designer-adobecc': 'Adobe Creative Cloud',
  'Designer-camera': 'Video Production',
  'Designer-cursor': 'Cursor',
  'Designer-figma': 'Figma',
  'Designer-framer': 'Framer',
  'Designer-mobile-android': 'Android',
  'Designer-mobile-ios': 'iOS',
  'Designer-pwa': 'Progressive Web Apps (PWA)',
  'Designer-sketch': 'Sketch',
  'Designer-vimeo': 'Vimeo',
  'Designer-web-css3': 'CSS3',
  'Designer-web-html5': 'HTML5',
  'Designer-web-uiux': 'UI/UX Design',
  'Designer-web-ux': 'UX Design',
  'Designer-webflow': 'Webflow',
  'Designer-youtube': 'YouTube',
  'Developer-OpenAI': 'OpenAI',
  'Developer-OpenAI-ChatGPT': 'ChatGPT',
  'Developer-TinaCMS': 'TinaCMS',
  'Developer-Unity3d': 'Unity',
  'Developer-Vue': 'Vue.js',
  'Developer-angular': 'Angular',
  'Developer-azure-function': 'Azure Functions',
  'Developer-blazor': 'Blazor',
  'Developer-c': 'C',
  'Developer-c-plusplus': 'C++',
  'Developer-c-sharp': 'C#',
  'Developer-cognitive-services': 'Azure AI Services (Cognitive Services)',
  'Developer-dart': 'Dart',
  'Developer-devops': 'DevOps',
  'Developer-docker': 'Docker',
  'Developer-dotnet-code': 'Universal Windows Platform',
  'Developer-dotnet-core': '.NET Core',
  'Developer-dotnet-foundation': '.NET Foundation',
  'Developer-dotnet-machine-learning': 'ML.NET',
  'Developer-dotnet-mvc': 'ASP.NET MVC',
  'Developer-firebase': 'Firebase',
  'Developer-flutter': 'Flutter',
  'Developer-github': 'GitHub',
  'Developer-golang': 'Go',
  'Developer-j-query': 'jQuery',
  'Developer-js': 'JavaScript',
  'Developer-kubernetes': 'Kubernetes',
  'Developer-linux': 'Linux',
  'Developer-microsoft-fabric': 'Microsoft Fabric',
  'Developer-mongodb-atlas': 'MongoDB Atlas',
  'Developer-nextjs': 'Next.js',
  'Developer-ngrx': 'NgRx',
  'Developer-node-js': 'Node.js',
  'Developer-playwright': 'Playwright',
  'Developer-powershell': 'PowerShell',
  'Developer-python': 'Python',
  'Developer-react': 'React',
  'Developer-rust': 'Rust',
  'Developer-rxjs': 'RxJS',
  'Developer-sharepoint-spfx': 'SharePoint Framework (SPFx)',
  'Developer-sitefinity': 'Sitefinity',
  'Developer-sql-server': 'SQL Server',
  'Developer-supabase': 'Supabase',
  'Developer-terraform': 'Terraform',
  'Developer-vuejs': 'Vue.js',
  'Developer-xamarin': 'Xamarin',
  'Developer-zig': 'Zig',
  'Event-DDD-Brisbane': 'DDD Brisbane Speaker',
  'Event-Microsoft-Ignite': 'Microsoft Ignite Speaker',
  'Event-global-ai-community': 'Global AI Community',
  'Event-hackday-ai': 'AI Hack Day Speaker',
  'Event-hackday-angular': 'Angular Hack Day Speaker',
  'Event-hackday-xamarin': 'Xamarin Hack Day Speaker',
  'Event-ug-canberra': 'Canberra .NET User Group Speaker',
  'Event-ug-melbourne': 'Melbourne .NET User Group Speaker',
  'Event-ug-sydney': 'Sydney .NET User Group Speaker',
  'Google-Techmaker': 'Google Women Techmakers',
  'MicrosoftCertifiedProfessional-Alt': 'Microsoft Certified Professional',
  'Myob-Logo': 'MYOB',
  'SysAdmin-CISM': 'Certified Information Security Manager (CISM)',
  'SysAdmin-CRISC': 'Certified in Risk and Information Systems Control (CRISC)',
  'SysAdmin-aruba': 'Aruba Networking',
  'SysAdmin-cisco': 'Cisco',
  'SysAdmin-microsoft-hyper-v': 'Microsoft Hyper-V',
  'Xero-Logo': 'Xero',
  'comptia-spotlight-future-leader-2024-shrunk':
    'CompTIA Spotlight Awards: Future Leader 2024',
  'kusto-detective-agency-complete-season1':
    'Kusto Detective Agency: Season 1 Complete',
  'scrum-product-owner': 'Certified Scrum Product Owner (CSPO)',
  'zzscrum-product-owner': 'Certified Scrum Product Owner (CSPO)',
};

module.exports = { badgeNames };
