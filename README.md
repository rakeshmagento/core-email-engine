## Installation & Configuration

1. Create `.env` file with following details

```
ELASTICSEARCH_HOST=ELASTICSEARCH_HOST
ELASTICSEARCH_AUTH_API=ELASTICSEARCH_AUTH_API
OUTLOOK_CLIENT_ID=OUTLOOK_CLIENT_ID
OUTLOOK_CLIENT_SECRET=OUTLOOK_CLIENT_SECRET
OUTLOOK_AUTHORIZE_URI=https://login.microsoftonline.com/common/oauth2/v2.0/authorize
OUTLOOK_TOKEN_URI=https://login.microsoftonline.com/common/oauth2/v2.0/token
OUTLOOK_EMAIL_URI=https://graph.microsoft.com/v1.0/me/messages
REDIRECT_URI=https://10d1-2401-4900-1c7a-9c17-19c3-f88b-80cf-b4ba.ngrok-free.app/api/account/callback
WEBHOOK_URI=https://10d1-2401-4900-1c7a-9c17-19c3-f88b-80cf-b4ba.ngrok-free.app/api/webhook
```
2. Replace `https://10d1-2401-4900-1c7a-9c17-19c3-f88b-80cf-b4ba.ngrok-free.app` under `REDIRECT_URI` and `WEBHOOK_URI` with yout ngrok mapped domain name.

3. Run command `docker compose up`, relax for few minutes. This will make ready containers and install the require dependecies for the project

4. Open home page by navigating to ngrok mapped domain or `http://localhost:3000`

5. Enter your outlook email and click submit to get the code and then redirection happend and get acccess token.

6. Once receieved the access token it will save these details under user and register subscription to receieve changes on email.

7. Once the above step complete, the user will be redirected to `/data` page and the sync process will be start, after 10 sec, it will automatic display 10 message.

