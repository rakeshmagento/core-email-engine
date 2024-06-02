const emailService = require('../services/emailService');

class EmailController {
    async getEmails(req, res, next) {
        try {
            const emails = await emailService.getEmails(req.query.localId);
            res.json(emails);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new EmailController();
