const { esClient } = require('../utils/elasticsearch');

class EmailRepository {

    async saveEmail(email) {
        
        try {
            await esClient.index({
                index: 'email_messages',
                body: {
                    message_id : email.id,
                    local_id: email.localId,
                    subject: email.subject,
                    sender: email.from.emailAddress.address,
                    recipients: email.toRecipients.map(recipient => recipient.emailAddress.address),
                    timestamp: email.receivedDateTime,
                    body: email.body.content,
                    folder: 'inbox',
                    read_status: email.isRead,
                    flags: email.flag.flagStatus,
                    created_at:new Date(),
                    updated_at : new Date()
                  }
            });
        } catch (error) {
            throw new Error(`Failed to save in email_messages: ${error.message}`);
        }
    }

    async getEmails(local_id) {
        try {
            const { body } = await esClient.search({
                index: 'email_messages',
                body: {
                    query: {
                        match: { 
                            local_id: `${local_id}`
                        }
                    },
                    "size": 10
                }
            });
            return body.hits.hits.map(hit => hit._source);
        } catch (error) {
            throw new Error(`Failed to get emails for user ${local_id}, Error : ${error.message}`);
        }
    }

    async getEmail(messageId){
        try{
            const response = await esClient.search({
                index: 'email_messages',
                body : {
                        query: {
                            match: {
                                message_id: `${messageId}`
                            }
                        }
                    }
            });
            const hits = response.body.hits.hits;
            if (hits.length > 0) {
                hits[0]._source._id = response.body.hits.hits[0]._id;
                return hits[0]._source;
            } 
            return {};
        }catch(error){
            throw new Error(`Failed to get email with id ${messageId}, Error: ${error.message}`);
        }
    }

    async deleteEmail(messageId){
         try {
            const response = await esClient.deleteByQuery({
              index: 'email_messages',
              body: {
                query: {
                  match: {
                    message_id: `${messageId}`
                  }
                }
              }
            });
            console.log(`Deleted ${response.body.deleted} documents`);
          } catch (error) {
            console.error('Error deleting email:', error);
          }
    }

    async updateEmail(documentId, updateBody){
        try{
            const updateResponse = await esClient.update({
              index: 'email_messages',
              id: documentId,
              body: {
                doc: updateBody
              }
            });
            console.log("Email updated successfully.", updateResponse);
        }catch(error){
            throw new Error(`Failed to update email : ${documentId}, Error : ${error.message}`);
        }
    }
}

module.exports = new EmailRepository();
