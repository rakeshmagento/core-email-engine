const express = require('express');
const accountController = require('./controllers/accountController');
const webhookController = require('./controllers/webhookController');
const emailController   = require('./controllers/emailController');
const syncController    = require('./controllers/syncController');

const router = express.Router();

router.post('/account', accountController.createAccount);
router.post('/webhook', webhookController.handleChanges);
router.get('/account/callback', accountController.handleCallback);
router.get('/emails', emailController.getEmails);
router.get('/sync', syncController.startSyncOfEmail);
module.exports = router;
