class User {
    constructor(id, outlookEmail, accessToken=null, refreshToken=null, expiresIn=null) {
        this.local_id = id;
        this.outlook_email = outlookEmail;
        this.access_token  = accessToken;
        this.refresh_token = refreshToken;
        this.expires_in    = expiresIn;
        this.created_at = new Date();
    }
}

module.exports = User;
