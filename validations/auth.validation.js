/* Third Party Libraries */
const {
    check,
    validationResult,
    body
} = require("express-validator");
const bodyValidator = require("express-validator").body;
const paramValidator = require("express-validator").param;
/* End Third Party Libraries */

/* Models*/
const ContractorRegistration = require('../models/contractorRegistration.model');
/* End Models*/

/* Helpers */
const Helper = require('../helpers/helper')
const isStrongPassword = Helper.strongPassword
/* End Helpers */

class AuthValidation {
    validateSendOtp() {
        return [
            bodyValidator(["phone"]).exists().withMessage('Mobile number is required')
                .isMobilePhone().withMessage('Invalid mobile number')
                .custom(async (value, { req }) => {
                    const contractor = await ContractorRegistration.findOne({
                        phone: value
                    });
                    if (contractor && contractor.isOtpVerified) {
                        throw new Error("This mobile number has already been registered");
                    }
                    return true;
                }),
            bodyValidator(["countryCode"]).exists().withMessage('Country code is required'),
            bodyValidator(["companyName"]).exists().withMessage('Company name is required')
        ]
    }

    validateRegister() {
        return [
            bodyValidator(["fullName"]).exists().withMessage('Full name is required'),
            bodyValidator(["userName"]).exists().withMessage('Username is required')
                .custom(async (value, { req }) => {
                    const contractor = await ContractorRegistration.findOne({
                        userName: value
                    });
                    if (contractor) {
                        throw new Error("This username has already been taken");
                    }
                    return true;
                }),
            bodyValidator(["companyName"]).exists().withMessage('Company name is required'),
            bodyValidator(["companyLogo"]).exists().withMessage('Please add your company logo'),
            bodyValidator(["countryCode"]).exists().withMessage('Country code is required'),
            bodyValidator(["phone"]).exists().withMessage('Mobile number is required')
                .isMobilePhone().withMessage('Invalid mobile number')
                .custom(async (value, { req }) => {
                    const contractor = await ContractorRegistration.findOne({
                        phone: value
                    });
                    if (!contractor) {
                        throw new Error("Request otp before registration");
                    }
                    if (contractor && contractor.isOtpVerified) {
                        throw new Error("This mobile number has already been registered");
                    }
                    return true;
                }),
            bodyValidator(["email"]).exists().withMessage('Email is required')
                .isEmail().withMessage('Invalid email')
                .custom(async (value, { req }) => {
                    const contractor = await ContractorRegistration.findOne({
                        email: value
                    });
                    if (contractor) {
                        throw new Error("This email has already been registered")
                    }
                    return true;
                }).normalizeEmail(),
            bodyValidator(["password"]).exists().withMessage('Password is required')
                .custom(isStrongPassword),
            bodyValidator(["otp"]).exists().withMessage('Please provide otp')
                .isNumeric().withMessage('Otp must be numeric').not().isString().withMessage('Otp cannot be a string')
                .isLength({ min: 6, max: 6 }).withMessage('Otp must be six digits'),
        ];
    }

    validateLogin() {
        return [
            bodyValidator(["userName"]).exists().withMessage('Please enter your username'),
            bodyValidator(["password"]).exists().withMessage('Please enter your password')
        ]
    }

    validateResetPasswordOtpRequest() {
        return [
            paramValidator(["phone"]).exists().withMessage('Mobile number is required')
                .isMobilePhone().withMessage('Invalid mobile number')
                .custom(async (value, { req }) => {
                    const contractor = await ContractorRegistration.findOne({
                        phone: value
                    });
                    if (!contractor) {
                        throw new Error("This mobile number has not been registered yet");
                    }
                    return true;
                }),
        ]
    }

    validateResetPassword() {
        return [
            bodyValidator(["phone"]).exists().withMessage('Mobile number is required')
                .isMobilePhone().withMessage('Invalid mobile number')
                .custom(async (value, { req }) => {
                    const contractor = await ContractorRegistration.findOne({
                        phone: value
                    });
                    if (!contractor) {
                        throw new Error("This mobile number has not been registered yet");
                    }
                    return true;
                }),
            bodyValidator(["resetPasswordOtp"]).exists().withMessage('Please provide otp')
                .isNumeric().withMessage('Otp must be numeric').not().isString().withMessage('Otp cannot be a string')
                .isLength({ min: 6, max: 6 }).withMessage('Otp must be six digits'),
            bodyValidator(["password"]).exists().withMessage('Password is required')
                .custom(isStrongPassword),
        ]
    }
}

module.exports = new AuthValidation()