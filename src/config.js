require('dotenv').config();

module.exports = {
  elasticsearch : {
    host : process.env.ELASTICSEARCH_HOST,
    authApiKey : process.env.ELASTICSEARCH_AUTH_API
  },
  outlook: {
    clientId     : process.env.OUTLOOK_CLIENT_ID,
    clientSecret : process.env.OUTLOOK_CLIENT_SECRET,
    authorizeUri : process.env.OUTLOOK_AUTHORIZE_URI,
    tokenUri     : process.env.OUTLOOK_TOKEN_URI,
    emailUri     : process.env.OUTLOOK_EMAIL_URI,
    redirectUri  : process.env.REDIRECT_URI,
    webhookUri   : process.env.WEBHOOK_URI
  }
};
