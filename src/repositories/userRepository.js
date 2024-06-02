const { esClient } = require('../utils/elasticsearch');

class UserRepository {
    
    async saveUser(user) {
        try {
            await esClient.index({
                index: 'user_emails',
                body: user
            });
        } catch (error) {
            throw new Error(`Failed to save user: ${error.message}`);
        }
    }

    async updateUser(documentId, updateBody){
        try{
            const updateResponse = await esClient.update({
              index: 'user_emails',
              id: documentId,
              body: {
                doc: updateBody
              }
            });
            console.log("Document updated:", updateResponse);
        }catch(error){
            throw new Error(`Failed to update documentId : ${documentId}, Error : ${error.message}`);
        }
    }

    async getUser(id) {
        try {
            const response = await esClient.search({
                index: 'user_emails',
                body : {
                        query: {
                            match: {
                                local_id: `${id}`
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
        } catch (error) {
            console.log(error);
            if (error.meta.statusCode === 404) {
                return null;
            }
            throw new Error(`Failed to get user: ${error.message}`);
        }
    }
}

module.exports = new UserRepository();
