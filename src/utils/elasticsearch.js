const config     = require('../config');
const { Client } = require('es7');

/* initialize the elasticsearch */
const esClient = new Client({
  node: config.elasticsearch.host,
  auth: { 
    apiKey: config.elasticsearch.authApiKey 
  }
})

/**  
 * create ElasticSearch indices
 */
async function initializeElasticSearchSchema() {

    const indices = [
        { 
            name: 'user_emails', 
            mappings: {
                properties : {
                    local_id      : {type : 'text', index : true},
                    outlook_email : {type : 'text'},
                    access_token  : {type : 'text'},
                    refresh_token : {type : 'text'},
                    id_token      : {type : 'text'},
                    expires_in    : {type : 'text'},
                    created_at : {type : 'date'},
                    updated_at : {type : 'date'}
                }
            }
        },
        {
            name: 'email_messages', 
            mappings: {
                properties : {
                    message_id : {type : 'text', index : true},
                    local_id   : {type : 'text'},
                    subject    : {type : 'text'},
                    sender     : {type : 'text'},
                    recipients : {type : 'text'},
                    timestamp  : {type : 'date'},
                    body       : {type : 'text'},
                    folder     : {type : 'text'},
                    read_status : {type : 'text'},
                    flags      : {type : 'text'},
                    created_at : {type : 'date'},
                    updated_at : {type : 'date'}
                }
            } 
        }
    ];

    try{
        for (const index of indices) {
            const exists = await esClient.indices.exists({ index: index.name });
            if (!exists.body) {
                await esClient.indices.create({
                    index: index.name,
                    body: {
                        mappings: index.mappings
                    }
                });
            }
        }
    }catch(error){
        throw new Error(`(initializeElasticSearchSchema) Failed to create indices : ${error.message}`);
    }
}

module.exports = { esClient, initializeElasticSearchSchema };
