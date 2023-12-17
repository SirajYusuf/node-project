/** Third-party libraries */
require('dotenv').config();
const _ = require('lodash');
const { GetObjectCommand } = require('@aws-sdk/client-s3')
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
/** End Third-party libraries */

/* Local Files */
const Helper = require('../helpers/helper');
const s3 = require('../config/s3.config');
const TwilioHelper = require('../helpers/twilio.helper')
/* Local Files */


class FilesController {

    expectedFiles() {
        return [
            'companyLogo',
            'documents',
            'supportingDocuments',
            'healthAndSafetyPolicyDocument',
            'accidentStaticsDocuments',
            'insuranceDocument',
            'companyTradeLicenseLegalDocuments',
            'mnrApprovedDocument',
            'companyBrochureDocument',
            'signature'
        ]
    }

    async uploadFiles(req, res) {
        try {
            if (!req['files'] || _.isEmpty(req['files'])) {
                throw new Error('Files required.');
            }
            const files = Object.keys(req.files)
                .map(key => {
                    console.log(req.files[key])
                    // return { [key]: req.files[key].map(file => file.filename) }; // For local storage
                    return { [key]: req.files[key].map(file => file.location) }; // For S3 Storage
                })
                .reduce((prev, curr) => {
                    return { ...prev, ...curr }
                });
            return Helper.successMessage(res, files);
        } catch (e) {
            return Helper.errorMessage(res, e.message);
        }
    }

    async retrieveFiles(req, res) {
        try {
            // const files = req.body.files
            // let signedUrls = []
            // for(const iterator of files){
            //     const input = {
            //         Bucket: process.env.AWS_BUCKET,
            //         Key: iterator
            //     };
            //     const command = new GetObjectCommand(input);
            //     signedUrls.push(await getSignedUrl(s3, command, { expiresIn: 43200}))   //time in seconds
            // }
            return Helper.successMessage(res, "signedUrls")
        } catch (e) {
            console.log(e)
            return Helper.errorMessage(res, e.message)
        }
    }
}

module.exports = new FilesController();