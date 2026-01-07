import { APP_CONSTANTS } from './constants';

export const en = {
  // Language selector
  language: {
    name: 'English',
    code: 'en'
  },

  // Home page
  home: {
    underConstruction: 'UNDER DEVELOPMENT',
    title: 'App Under Construction',
    description: 'We are developing a complete platform for Instagram data analysis and audience metrics through Meta API.',
    featuresTitle: 'Planned Features',
    features: [
      'Automatic Instagram post data collection',
      'Detailed audience metrics analysis',
      'Customized performance reports',
      'Engagement and reach insights'
    ],
    privacyLink: '🔒 Privacy Policy',
    termsLink: '📋 Terms of Use',
    footer: 'Soon, you will be able to transform your Instagram data into valuable insights!'
  },

  // Privacy page
  privacy: {
    backToHome: '← Back to Home',
    title: '🔒 Privacy Policy',
    lastUpdated: `Last updated: ${APP_CONSTANTS.lastUpdated}`,
    intro: 'This Privacy Policy describes how we collect, use, store, and protect user data in our Instagram analysis application.',
    
    section1: {
      title: '1. Information We Collect',
      description: 'Our application collects only data that you explicitly authorize through Meta/Instagram OAuth authentication. This data includes:',
      items: [
        '<strong>Profile Information:</strong> Username, display name, profile picture, and bio',
        '<strong>Media Data:</strong> Published posts, including photos, videos, captions, URLs, and timestamps',
        '<strong>Engagement Metrics:</strong> Number of likes, comments, views, and other public metrics provided by Instagram API',
        '<strong>Audience Information:</strong> Demographic data and reach statistics, when available and authorized'
      ],
      note: '<strong>Important:</strong> We collect ONLY the data you explicitly authorize through Meta API permissions. We do not have access to private messages, login information, or any unauthorized data.'
    },

    section2: {
      title: '2. How We Use the Data',
      description: 'The collected data is used exclusively to:',
      items: [
        'Generate analyses and reports on Instagram post and profile performance',
        'Calculate audience engagement and reach metrics',
        'Create customized data dashboards and visualizations',
        'Provide insights on content trends and patterns',
        'Improve the quality and accuracy of provided analyses'
      ]
    },

    section3: {
      title: '3. Storage and Security',
      description: 'We implement technical and organizational security measures to protect your data:',
      items: [
        'Data encryption in transit and at rest',
        'Restricted data access only for authorized processing',
        'Regular security monitoring and system updates',
        'Compliance with Meta Platform security guidelines'
      ]
    },

    section4: {
      title: '4. Data Sharing',
      noShare: '<strong>We do not share, sell, or rent your personal data to third parties.</strong>',
      description: 'Your data is used exclusively within our platform to provide the requested analysis services. We may share data only in the following circumstances:',
      items: [
        'With your express consent',
        'When required by law or court order',
        'To protect our legal rights or user safety'
      ]
    },

    section5: {
      title: '5. Your Rights',
      description: 'You have the following rights regarding your data:',
      items: [
        '<strong>Access:</strong> Request a copy of the data we have about you',
        '<strong>Correction:</strong> Request correction of inaccurate data',
        '<strong>Deletion:</strong> Request complete deletion of your data',
        '<strong>Revocation:</strong> Revoke access permissions at any time through Instagram settings',
        '<strong>Portability:</strong> Request your data in machine-readable format'
      ],
      contact: `To exercise any of these rights, contact us at: <strong>${APP_CONSTANTS.emails.privacy}</strong>`
    },

    section6: {
      title: '6. Data Retention',
      description: 'We retain your data only for as long as necessary to provide the requested services or as required by law. You can request deletion of your data at any time, and it will be removed from our systems within 30 days.'
    },

    section7: {
      title: '7. Cookies and Similar Technologies',
      description: 'We use cookies and similar technologies only for essential application functionalities, such as maintaining your active session and user preferences. We do not use third-party cookies for tracking or advertising.'
    },

    section8: {
      title: '8. Meta Platform Compliance',
      description: 'This application complies with the <a href="https://developers.facebook.com/terms" target="_blank" rel="noopener noreferrer">Meta Platform Terms</a> and <a href="https://developers.facebook.com/policy" target="_blank" rel="noopener noreferrer">Meta Data Policy</a>. We respect all limitations and requirements imposed by the Instagram API.'
    },

    section9: {
      title: '9. Changes to This Policy',
      description: 'We may update this Privacy Policy periodically. We will notify you of significant changes through the application or by email. The most recent version will always be available on this page with the update date.'
    },

    section10: {
      title: '10. Contact',
      description: 'If you have questions, concerns, or requests related to this Privacy Policy or data handling, contact us:',
      email: `<strong>Email:</strong> ${APP_CONSTANTS.emails.privacy}`,
      support: `<strong>Support:</strong> ${APP_CONSTANTS.emails.support}`
    },

    homeLink: '🏠 Home',
    termsLink: '📋 Terms of Use',
    dataDeletionLink: '🗑️ Data Deletion'
  },

  // Data Deletion page
  dataDeletion: {
    backToHome: '← Back to Home',
    title: '🗑️ Data Deletion Request',
    lastUpdated: `Last updated: ${APP_CONSTANTS.lastUpdated}`,
    intro: 'You have the right to request the complete deletion of your data from our platform. This page explains how to make this request and what to expect.',

    section1: {
      title: '1. Your Right to Data Deletion',
      description: 'In accordance with data protection regulations and Meta Platform policies, you can request the deletion of all data we have collected about your Instagram account. This includes:',
      items: [
        'Profile information (username, display name, bio)',
        'Media data (posts, photos, videos, captions)',
        'Engagement metrics (likes, comments, views)',
        'All analysis reports and insights generated',
        'Access logs and usage history'
      ]
    },

    section2: {
      title: '2. How to Request Data Deletion',
      description: 'To request the deletion of your data, follow these steps:',
      steps: [
        `Send an email to <strong>${APP_CONSTANTS.emails.privacy}</strong>`,
        'In the subject line, write: "Data Deletion Request"',
        'In the email body, include:',
        '• Your Instagram username',
        '• The email address associated with your account (if applicable)',
        '• Confirmation that you want all your data deleted',
        'We will confirm receipt of your request within 48 hours'
      ]
    },

    section3: {
      title: '3. Processing Timeline',
      description: 'Your data deletion request will be processed according to the following timeline:',
      items: [
        '<strong>Confirmation:</strong> Within 48 hours of receiving your request',
        '<strong>Processing:</strong> Up to 30 days for complete data removal',
        '<strong>Completion Notification:</strong> Email confirmation when deletion is complete',
        '<strong>Backup Systems:</strong> Data in backup systems will be deleted in the next scheduled backup cycle (up to 90 days)'
      ]
    },

    section4: {
      title: '4. What Happens After Deletion',
      warning: '<strong>Important:</strong> Data deletion is irreversible. Once your data is deleted:',
      items: [
        'You will lose access to all analysis reports and insights',
        'Historical data and metrics will no longer be available',
        'You will need to re-authorize the application to use services again',
        'Previous analyses cannot be recovered',
        'The deletion process cannot be undone'
      ]
    },

    section5: {
      title: '5. Revoking Instagram Permissions',
      description: 'In addition to requesting data deletion from our platform, you can also revoke our application\'s access to your Instagram account:',
      steps: [
        'Go to your Instagram Settings',
        'Navigate to "Security" → "Apps and Websites"',
        'Find our application in the list',
        'Click "Remove" to revoke all permissions',
        'Note: This does not delete data we already collected; you must submit a deletion request for that'
      ]
    },

    section6: {
      title: '6. Exceptions and Legal Requirements',
      description: 'We may retain certain information if required by law or for legitimate business purposes:',
      items: [
        'Data required to comply with legal obligations',
        'Information necessary to resolve disputes or enforce agreements',
        'Anonymized data used for statistical analysis (cannot identify you)',
        'Audit logs required for security purposes'
      ],
      note: 'Any retained data will be limited to what is legally required and will be kept secure.'
    },

    section7: {
      title: '7. Questions or Issues',
      description: `If you have questions about the data deletion process or encounter any issues, please contact us at <strong>${APP_CONSTANTS.emails.support}</strong>`,
      response: 'We will respond to your inquiry within 2 business days.'
    },

    section8: {
      title: '8. Meta Platform Compliance',
      description: `This data deletion process complies with <a href="https://developers.facebook.com/docs/development/create-an-app/app-dashboard/data-deletion-callback" target="_blank" rel="noopener noreferrer">Meta Platform Data Deletion Requirements</a>. For more information about your rights, see our <a href="/privacy">Privacy Policy</a>.`
    },

    homeLink: '🏠 Home',
    privacyLink: '🔒 Privacy Policy',
    termsLink: '📋 Terms of Use'
  },

  // Terms page
  terms: {
    backToHome: '← Back to Home',
    title: '📋 Terms of Use',
    lastUpdated: `Last updated: ${APP_CONSTANTS.lastUpdated}`,
    intro: 'Welcome to our Instagram analysis application. By using this service, you agree to the terms and conditions described below.',

    section1: {
      title: '1. Acceptance of Terms',
      description: 'By accessing and using this application, you accept and agree to comply with these Terms of Use and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this service.',
      warning: '<strong>Attention:</strong> Use of this application implies automatic acceptance of these terms. Please read them carefully.'
    },

    section2: {
      title: '2. Service Description',
      description: 'This application provides analysis tools for public Instagram data collected through the official Meta Platform API. Services include:',
      items: [
        'Automated collection of Instagram post and profile data',
        'Engagement and reach metrics analysis',
        'Generation of customized reports and dashboards',
        'Insights on content performance and audience'
      ]
    },

    section3: {
      title: '3. Usage Requirements',
      description: 'To use this service, you must:',
      items: [
        'Be at least 18 years old or of legal age in your jurisdiction',
        'Have an active Instagram account',
        'Have authorization to access the data to be analyzed',
        'Agree to Instagram and Meta Platform Terms of Service',
        'Not use the service for illegal or unauthorized purposes'
      ]
    },

    section4: {
      title: '4. Authentication and Permissions',
      description: 'You authorize this application to access your Instagram data through Meta OAuth authentication. You can:',
      items: [
        'Revoke permissions at any time through Instagram settings',
        'Control which data is shared during the authorization process',
        'Request deletion of all collected data'
      ],
      note: '<strong>Important:</strong> Revoking permissions may result in interruption of analysis services.'
    },

    section5: {
      title: '5. Acceptable Use',
      description: 'You agree NOT to:',
      items: [
        'Use the service to violate any applicable laws or regulations',
        'Attempt to access data from accounts you do not own or are not authorized',
        'Reverse engineer, decompile, or disassemble the application',
        'Use the service for spam, fraud, or other malicious activities',
        'Overload or interfere with the application infrastructure',
        'Violate Instagram or Meta Platform Terms of Service',
        'Collect data in a way that violates other users\' privacy',
        'Resell or redistribute data or services without authorization'
      ]
    },

    section6: {
      title: '6. Service Limitations',
      description: 'The application is subject to limitations imposed by Instagram API:',
      items: [
        'Request rate limits',
        'Data availability according to Meta policies',
        'Changes in API functionalities',
        'Possible interruptions for maintenance or updates'
      ],
      note: 'We do not guarantee uninterrupted service availability and reserve the right to modify, suspend, or discontinue features at any time.'
    },

    section7: {
      title: '7. Intellectual Property',
      yourData: '<strong>Your Data:</strong> You retain all rights to your Instagram data. We do not claim ownership of your content.',
      ourService: '<strong>Our Service:</strong> The application, including its code, design, brand, and features, is our exclusive property and protected by intellectual property laws.'
    },

    section8: {
      title: '8. Limitation of Liability',
      description: 'This service is provided "AS IS" and "AS AVAILABLE". We do not guarantee:',
      items: [
        'Accuracy or completeness of collected data',
        'Continuous service availability',
        'Suitability for any specific purpose',
        'Absence of errors or interruptions'
      ],
      warning: '<strong>Important:</strong> Under no circumstances will we be liable for direct, indirect, incidental, consequential, or punitive damages resulting from the use or inability to use this service.'
    },

    section9: {
      title: '9. Meta Platform Compliance',
      description: 'This application operates in compliance with:',
      items: [
        '<a href="https://developers.facebook.com/terms" target="_blank" rel="noopener noreferrer">Meta Platform Terms</a>',
        '<a href="https://developers.facebook.com/policy" target="_blank" rel="noopener noreferrer">Meta Platform Policy</a>',
        '<a href="https://help.instagram.com/581066165581870" target="_blank" rel="noopener noreferrer">Instagram Terms of Use</a>',
        'Instagram Graph API - Terms and Limitations'
      ],
      note: 'Any violations of these terms may result in suspension or termination of application access.'
    },

    section10: {
      title: '10. Privacy and Data Protection',
      description: 'Use of your data is governed by our <a href="/privacy">Privacy Policy</a>. By using this service, you also agree to our privacy policy terms.'
    },

    section11: {
      title: '11. Suspension and Termination',
      description: 'We reserve the right to suspend or terminate your access to the service at any time and without prior notice if:',
      items: [
        'You violate these Terms of Use',
        'You violate Meta Platform or Instagram terms',
        'Your use poses a security or legal risk',
        'You engage in fraudulent or abusive activities'
      ]
    },

    section12: {
      title: '12. Changes to Terms',
      description: 'We may update these Terms of Use periodically to reflect changes in our services or legal requirements. Significant changes will be communicated through:',
      items: [
        'Notification within the application',
        'Email to the registered address',
        'Update date on this page'
      ],
      note: 'Continued use of the service after changes constitutes acceptance of the new terms.'
    },

    section13: {
      title: '13. Applicable Law',
      description: 'These terms are governed and interpreted in accordance with the laws of the United States. Any disputes related to these terms will be resolved in the competent courts of the United States.'
    },

    section14: {
      title: '14. Contact',
      description: 'For questions, support, or issues related to these Terms of Use:',
      support: `<strong>Support Email:</strong> ${APP_CONSTANTS.emails.support}`,
      legal: `<strong>Legal Email:</strong> ${APP_CONSTANTS.emails.legal}`
    },

    versionInfo: {
      lastUpdate: `<strong>Last Update:</strong> ${APP_CONSTANTS.lastUpdated}`,
      version: `<strong>Version:</strong> ${APP_CONSTANTS.version}`,
      effectiveDate: `<strong>Effective Date:</strong> ${APP_CONSTANTS.effectiveDate}`
    },

    homeLink: '🏠 Home',
    privacyLink: '🔒 Privacy Policy'
  }
};
