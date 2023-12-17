/** Third Party Libraries */
require('dotenv').config();
const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env
const accountSid = TWILIO_ACCOUNT_SID;
const authToken = TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
/** End Third Party Libraries */

/** Local Files */
/** End Local Files */

class TwilioHelper {
    async sendMessage(to, body){
        try {
            const message = await client.messages.create({
                body,
                to,
                from: '+12545408765',
            });
            console.log(message);
        } catch (error) {
            console.error(error);
            throw error
        }
    }
}

module.exports = new TwilioHelper()