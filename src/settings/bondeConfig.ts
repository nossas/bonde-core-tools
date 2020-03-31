export default {
  development: {
    // Modules URLs
    accounts: 'http://accounts.bonde.devel:5000/login',
    settings: 'http://admin-canary.bonde.devel:5001/community/settings',
    mobilization: 'http://app.bonde.devel:5002/mobilizations',
    chatbot: 'http://chatbot.bonde.devel:5003',
    redes: 'http://redes.bonde.devel:5004',
    // Essentials URLs
    crossStorage: 'http://cross-storage.bonde.devel',
    apiGraphql: 'https://api-graphql.staging.bonde.org/v1/graphql',
  },
  staging: {
    // Modules URLs
    accounts: 'https://accounts.staging.bonde.org/login',
    mobilization: 'https://app.staging.bonde.org',
    settings: 'https://admin-canary.staging.bonde.org',
    chatbot: 'https://chatbot.staging.bonde.org',
    redes: 'https://redes.staging.bonde.org',
    // Essentials URLs
    crossStorage: 'https://cross-storage.staging.bonde.org',
    apiGraphql: 'https://api-graphql.staging.bonde.org/v1/graphql',
  },
  production: {
    // Modules URLs
    accounts: 'https://accounts.bonde.org/login',
    mobilization: 'https://app.bonde.org',
    settings: 'https://admin-canary.bonde.org',
    chatbot: 'https://chatbot.bonde.org',
    redes: 'https://redes.bonde.org',
    // Essentials URLs
    crossStorage: 'https://cross-storage.bonde.org',
    apiGraphql: 'https://api-graphql.bonde.org/v1/graphql',
  },
};
