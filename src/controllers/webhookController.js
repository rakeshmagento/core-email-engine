const emailService   = require('../services/emailService');
const userRepository = require('../repositories/userRepository');
const lockResource = require('../utils/lock');

class WebhookController {

    async handleChanges(req, res, next) {
        await lockResource.lock();
        try {
            const validationToken = req.query.validationToken;
            console.log('validationToken', validationToken);
           
            if(validationToken) {
               res.status(200).send(validationToken);
            } else {
                console.log('Webhook receieved notification', req.body);
                const requestBody   = req.body;
                const subscriptions = requestBody.hasOwnProperty('value') ? requestBody.value : [];

                for (const subscription of subscriptions) {


                    console.log('resourceData', subscription.resourceData);
                    const resourceId  = subscription.resourceData.id;
                    const changeType  = subscription.changeType;
                    const clientState = subscription.clientState; //contains localUserId
                    const user = await userRepository.getUser(clientState);

                    if(!user){
                        console.log(`User not found ID : ${clientState} `);
                        continue;
                    }

                    if(resourceId && changeType && user){
                        if(changeType == 'deleted'){
                            await emailService.deleteEmail(resourceId);
                        }else if(changeType == 'created'){
                            await emailService.createEmail(resourceId, user.access_token, user.refresh_token);
                        }else if(changeType == 'updated'){
                            await emailService.updateEmail(resourceId, user.access_token, user.refresh_token);
                        }else{
                            console.log(`Invalid changeType : ${changeType} , Failed to process email notification`, JSON.stringify(subscription));
                            continue;
                        }
                    }
                }
                res.sendStatus(200);
            }
        } catch (error) {
            next(error);
        }finally {
            lockResource.unlock();
            console.log('Lock released.');
        }
    }
}

module.exports = new WebhookController();
