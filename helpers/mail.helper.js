/** Third Party Libraries */
require('dotenv').config();
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
/** End Third Party Libraries */

/** Local Files */
/** End Local Files */

const url = {
    baseUrl: 'https://test_url.onrender.com'
}

class MailHelper {
    async sendVerificationEmail({ to, fullName, companyId, companyName, emailToken }) {
        const msg = {
            to,
            from: 'test@gmail.com',//replace with proper email
            subject: 'Email Verification',
            html: `
            Thank You! for signing up as an administrator ${fullName}. Your organisation id has been created ${companyId} for your organisation ${companyName}. 
            Kindly click on the link below to verify your email and get started with you organisation onboarding.
            <br>
            <br>ThankYou!
            <br>
            <br><strong><a href="${url.baseUrl}/auth/verify-email/${emailToken}"> CLICK HERE</a></strong>`
        };
        try {
            await sgMail.send(msg);
        } catch (error) {
            throw new Error('Error in sendgrid ')
        }

    }

    async sendWelcomeEmail(to, contractorName) {
        const msg = {
            to,
            from: 'test@gmail.com',//replace with proper email
            subject: 'Welcome Email',
            html: `
            Dear ${contractorName},<br>
<br>
We are pleased to inform you that your application for onboarding. Congratulations! We warmly welcome you to our esteemed platform. <br>
<br>
`
        };
        try {
            await sgMail.send(msg);
        } catch (error) {
            console.log(JSON.stringify(error.response))
            throw new Error('Error in sendgrid ')
        }

    }
}

module.exports = new MailHelper()