const userService = require('../services/userService');

class AccountController {

    async createAccount(req, res, next) {
        
        try {
            if(!req.body.hasOwnProperty('email')){
                throw new Error("Email doesn't exists.");
            }
            const url = await userService.createAccount(req.body.email);
            res.json({ url });
        } catch (error) {
            next(error);
        }
    }

    async handleCallback(req, res, next) {
        try {
            const {code, state } = req.query;
            await userService.handleCallback(req.query);
            res.redirect(`/data?localId=${state}`);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AccountController();
