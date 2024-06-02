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



