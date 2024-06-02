const emailRepository = require('../repositories/emailRepository');
const { fetchEmails, featchEmailById } = require('../utils/outlookAuth');

class EmailService {

    constructor(){
        this.pageSize = 50;
    }

    async getEmails(localId) {
        try {
            return await emailRepository.getEmails(localId);
        } catch (error) {
            throw new Error(`(getEmails) Failed to get emails: ${error.message}`);
        }
    }

    async syncEmails(user) {

        let totalSynced = 0;
        let skip = 0;

        try {
            const accessToken  = user.access_token;
            const refreshToken = user.refresh_token;
            const userLocalId = user.local_id;

            while (true) {
              const messages = await fetchEmails(this.pageSize, skip, accessToken, refreshToken);
              let messagesCount = messages.length;
              console.log('messagesCount', messagesCount)
              if (messagesCount === 0) {
                console.log('No more messages to sync.');
                break;
              }
              for (const email of messages) {
                await emailRepository.saveEmail({ localId: user.local_id, ...email });
              }
              totalSynced += messagesCount;
              skip += this.pageSize;
            }
            console.log(`Total ${totalSynced} messages synced for User : ${userLocalId}`);
        } catch (error) {
            console.error('Error syncing messages with pagination:', error);
        }
    }

    async deleteEmail(emailId) {
        try {
            return await emailRepository.deleteEmail(emailId);
        } catch (error) {
            throw new Error(`(deleteEmail) Failed to delete email ${emailId}, Error : ${error.message}`);
        }
    }

    async createEmail(emailId, accessToken, refreshToken) {
        try {
            const localEmailExists = await emailRepository.getEmail(emailId);
            if(Object.keys(localEmailExists).length){
                console.error(`(createEmail) Can't create email , email with ID : ${emailId} already exists.`);
            }else{
                const emailData = await featchEmailById(emailId, accessToken, refreshToken);
                return await emailRepository.saveEmail(emailData);
            }
        } catch (error) {
            throw new Error(`(createEmail) Failed to createEmail, Error : ${error.message}`);
        }
    }

    async updateEmail(emailId, accessToken, refreshToken) {
        try {
            const localEmailExists = await emailRepository.getEmail(emailId);
            const emailData = await featchEmailById(emailId, accessToken, refreshToken);
            
            if(Object.keys(localEmailExists).length){
                const dataToBeUpdated = {
                    read_status : emailData.isRead,
                    flags : emailData.flagStatus
                };
                return await emailRepository.updateEmail(localEmailExists._id, dataToBeUpdated);
            }else{
                console.error(`(updateEmail) Can't update email , email with ID : ${emailId} doesn't exists.`);
            }
        } catch (error) {
            throw new Error(`(updateEmail) Failed to updateEmail, Error : ${error.message}`);
        }
    }

}

module.exports = new EmailService();
