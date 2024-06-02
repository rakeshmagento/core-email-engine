const { v4: uuidv4 } = require('uuid');
const User = require('../models/userModel');
const userRepository = require('../repositories/userRepository');
const { getAuthorizeUrl, getTokenFromCode, registerSubscription } = require('../utils/outlookAuth');

class UserService {
    async createAccount( outlookEmail ) {
        try {
            const userLocalId = uuidv4();
            const url = getAuthorizeUrl(outlookEmail, userLocalId);
            const user = new User(userLocalId, outlookEmail);
            await userRepository.saveUser(user);
            return url;
        } catch (error) {
            throw new Error(`(createAccount) Failed to create account: ${error.message}`);
        }
    }

    async handleCallback(queryParams) {
        try {
            const {code, state } = queryParams;
            const token = await getTokenFromCode(code);
            const user = await userRepository.getUser(state);
            
            if (user) {
                const documentId = user._id;
                
                const updateDoc  = {
                    access_token  : token.access_token,
                    refresh_token : token.refresh_token,
                    id_token   : token.id_token,
                    expires_in : token.expires_in,
                    updated_at : new Date()
                };
                await userRepository.updateUser(documentId,updateDoc);
                //Register webhook to monitor changes 
                await registerSubscription(token.access_token, user.local_id);
            }else{
                throw new Error('(handleCallback) User not found!');
            }
        } catch (error) {
            throw new Error(`(handleCallback) Failed to handle callback: ${error.message}`);
        }
    }
}

module.exports = new UserService();
