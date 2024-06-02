const axios = require('axios');
const qs = require('querystring');
const config = require('../config');
const graph = require('mgc');
const Bottleneck = require('bottleneck');

// Configure rate limiting
const limiter = new Bottleneck({
  maxConcurrent: 1, // Maximum number of concurrent requests
  minTime: 1000 // Minimum time (in milliseconds) between requests
});

function getAuthorizeUrl(outlookEmail, userLocalId) {
    const qryParams = qs.stringify({
        client_id: config.outlook.clientId,
        response_type: 'code',
        redirect_uri: config.outlook.redirectUri,
        state : userLocalId,
        scope: 'openid profile offline_access User.Read Mail.Read',
        login_hint: outlookEmail,
        response_mode: 'query',
    });
    console.log('getAuthorizeUrl outlookEmail', outlookEmail);
    return `${config.outlook.authorizeUri}`+'?'+`${qryParams}`;
}

async function getTokenFromCode(code, maxRetries = 3, retryDelay = 1000) {

    let retries = 0;

    while (retries < maxRetries) {
        try{

            const response = await axios.post( `${config.outlook.tokenUri}`, qs.stringify({
                client_id: config.outlook.clientId,
                client_secret: config.outlook.clientSecret,
                code,
                redirect_uri: config.outlook.redirectUri,
                grant_type: 'authorization_code'
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            // Check if the API call was successful
            if(response.status === 200) {
                return response.data; // Return data 
            }else {
                throw new Error(`API request failed with status code ${response.status}`);
            }
        }catch(error){

            let errorRes = error.response.data;
            console.log(`Attempt ${retries + 1} Error`, {errorRes});
            retries++;
            // Check if there are more retries left
            if (retries < maxRetries) {
                console.log(`Retrying in ${retryDelay} milliseconds...`);
                await new Promise(resolve => setTimeout(resolve, retryDelay)); // Wait for the retry delay
            } else {
                throw new Error(`Error After Retrying ${retries} times.`);
            }
        }
    }
}


async function refreshAccessToken(refreshToken) {

  try {
    const response = await axios.post(`${config.outlook.tokenUri}`, qs.stringify({
                client_id: config.outlook.clientId,
                client_secret: config.outlook.clientSecret,
                refresh_token: `${refreshToken}`,
                grant_type: 'refresh_token'
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

    
    return response.data;
  } catch (error) {
    console.error('Error refreshing access token:', error.response ? error.response.data : error.message);
  }
}

async function fetchEmails(limit, skip, accessToken, refreshToken, maxRetries = 3, retryDelay = 1000) {
    let retries = 0;
    let newAccessToken = null;
    
    while (retries < maxRetries) {

        try {
            if(newAccessToken){
                accessToken = newAccessToken;
            }

            const response = await limiter.schedule(() =>
            axios.get(`${config.outlook.emailUri}`, {
                headers: {
                  Authorization: `Bearer ${accessToken}`
                },
                params: {
                  $top: limit,
                  $skip: skip
                }
              })
            );
            // Check if the API call was successful
            if(response.status === 200) {
                return response.data.value; // Return data 
            }else {
                throw new Error(`Fetch API request failed with status code ${response.status}`);
            }
        } catch (error) {
            
            //Refresh AccessToken
            if(error.response.status == 401 && error.response.statusText == 'Unauthorized'){
                let outlookErrorData = error.response.data;
                const refreshAccessTokenResponse = await refreshAccessToken(refreshToken);
                newAccessToken = refreshAccessTokenResponse.access_token;
            }
            
            retries++;
            // Check if there are more retries left
            if (retries < maxRetries) {
                console.log(`Retrying in ${retryDelay} milliseconds...`);
                await new Promise(resolve => setTimeout(resolve, retryDelay)); // Wait for the retry delay
            } else {
                throw new Error(`Error (fetchEmails) After Retrying ${retries} times.`);
            }
        }
    }
}


async function featchEmailById(emailId, accessToken, refreshToken, maxRetries = 3, retryDelay = 1000){

    console.log('accessToken', accessToken);
    let retries = 0;
    let newAccessToken = null;

    while (retries < maxRetries) {
        try{
            if(newAccessToken){
                accessToken = newAccessToken;
            }
            const response = await axios.get(`${config.outlook.emailUri}`+'/'+`${emailId}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
            // Check if the API call was successful
            if(response.status === 200) {
                return response.data; // Return data 
            }else {
                throw new Error(`(featchEmailById) API request failed with status code ${response.status}`);
            }
            return response.data;
        }catch(error){
            let errorRes = error.response.data;
            console.log(`(featchEmailById) Attempt ${retries + 1} Error`, {errorRes});
            //Refresh AccessToken
            if(error.response.status == 401 && error.response.statusText == 'Unauthorized'){
                let outlookErrorData = error.response.data;
                const refreshAccessTokenResponse = await refreshAccessToken(refreshToken);
                newAccessToken = refreshAccessTokenResponse.access_token;
            }
            retries++;
            // Check if there are more retries left
            if (retries < maxRetries) {
                console.log(`(featchEmailById) Retrying in ${retryDelay} milliseconds...`);
                await new Promise(resolve => setTimeout(resolve, retryDelay)); // Wait for the retry delay
            } else {
                throw new Error(`(featchEmailById) Error After Retrying ${retries} times.`);
            }
        }
    }   
}

async function registerSubscription(accessToken,localUserId){
    // Initialize Microsoft Graph client
    const grapthClient = graph.Client.init({
      authProvider: (done) => {
        done(null, `${accessToken}`);
      }
    });
    try {
        const subscription = {
          changeType: 'created,updated,deleted', 
          notificationUrl: `${config.outlook.webhookUri}`,
          resource: '/me/mailFolders/inbox/messages',
          expirationDateTime: '2024-06-06T00:00:00Z',
          clientState: `${localUserId}`
        };
        const result = await grapthClient.api('/subscriptions').post(subscription);
        console.log(result);
    } catch (error) {
        console.error(error);
    }
}



module.exports = {
    getAuthorizeUrl, 
    getTokenFromCode, 
    refreshAccessToken, 
    fetchEmails, 
    featchEmailById, 
    registerSubscription 
};
