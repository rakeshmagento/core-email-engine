const userService = require('../services/userService');
const userRepository = require('../repositories/userRepository');
const emailService = require('../services/emailService');

class SyncController {

    async startSyncOfEmail(req, res, next){
        try{
            const localId = req.query.localId;

            const user = await userRepository.getUser(localId);
            console.log('startSyncOfEmail user',user);
            if (!user) {
                throw new Error('User not found');
            }
            await emailService.syncEmails(user);
        }catch(error){
            next(error);
        }
    }
}

module.exports = new SyncController();
