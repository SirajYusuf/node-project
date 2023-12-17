/* Libraries*/
require('dotenv').config();
const _ = require("lodash");
const moment = require('moment')
const { v4: uuidv4 } = require('uuid');
/* End Libraries*/

/* Models*/
const ContractorRegistration = require('../../models/contractorRegistration.model');
const ContractorDetails = require('../../models/contractorDetails.model');
/* End Models*/

/* Helpers */
const Helper = require('../../helpers/helper');
const TwilioHelper = require('../../helpers/twilio.helper');
/* End Helpers */

/** Local Files */
const { registrationOtpSms, resetPasswordOtpSms } = require('../../resources/templates/sms.template');
const MailHelper = require('../../helpers/mail.helper');
/** End Local Files */

class Auth {
    async postSendOtp(req, res) {
        const session = req.dbSession
        try {
            const body = {
                countryCode: req.body.countryCode,
                phone: req.body.phone,
                companyName: req.body.companyName,
                otp: Helper.generateOTP(),
                otpGeneratedAt: new Date().toISOString()
            };
            const contractor = await ContractorRegistration.findOne({ phone: body.phone }).select('phone');
            if (contractor) {
                contractor.otp = body.otp;
                contractor.otpGeneratedAt = body.otpGeneratedAt
                await contractor.save({ session });
            } else {
                await new ContractorRegistration(body).save({ session });
            }
            // Send Twilio sms
            body.phone = body.countryCode + body.phone
            await TwilioHelper.sendMessage(body.phone, registrationOtpSms(body.otp, body.companyName))
            return Helper.successMessage(res, "Otp sent successfully");
        } catch (e) {
            return Helper.errorMessage(res, e);
        }
    }

    async postRegister(req, res) {
        const session = req.dbSession
        try {
            const { otp, ...body } = _.pick(req.body, [
                'fullName',
                'userName',
                'companyName',
                'companyLogo',
                'countryCode',
                'phone',
                'email',
                'password',
                'otp'
            ]);
            //compare otp
            const isValidOtp = await ContractorRegistration.findOne({
                phone: body.phone
            }).select('otp otpGeneratedAt');
            const differenceInVerifiedAt = moment().diff(isValidOtp.otpGeneratedAt, 'minutes')
            if (isValidOtp.otp !== otp) {
                throw new Error('Invalid otp!')
            };
            if (differenceInVerifiedAt > 5) {
                throw new Error("otp expired")
            }
            //save contractor and generate token
            body.password = Helper.hashString(body.password);
            body.isOtpVerified = true;
            body.emailToken = uuidv4();
            const contractor = await ContractorRegistration.findByIdAndUpdate(isValidOtp._id, body, { new: true }).session(session);
            await contractor.generateToken(session)
            //create Contractor Details
            const companyPayload = {
                contractor: contractor._id, 
                companyInformation: {
                    companyName: body.companyName,
                    companyLogo: body.companyLogo,
                    companyId: Helper.generateAcronym(body.companyName)
                }
            }
            await new ContractorDetails(companyPayload).save({ session })
            //send email
            await MailHelper.sendVerificationEmail({
                to: body.email,
                fullName: body.fullName,
                companyId: companyPayload.companyInformation.companyId,
                companyName: body.companyName,
                emailToken: body.emailToken
            })
            return Helper.successMessage(res, contractor);
        } catch (e) {
            return Helper.errorMessage(res, e.message);
        }

    }

    async postLogin(req, res) {
        const session = req.dbSession
        try {
            const body = _.pick(req.body, [
                'userName',
                'password'
            ]);
            const contractor = await ContractorRegistration.findOne({ userName: body.userName }).select('+password');
            if (!contractor) {
                throw new Error('contractor not found!');
            };
            if (contractor && !contractor.isOtpVerified) {
                throw new Error('Please verify your mobile number before logging in');
            };
            if (contractor && !contractor.isEmailVerified) {
                throw new Error('Please verify your email address before logging in');
            };
            const verifiedPassword = Helper.compareHashedString(body.password, contractor.password)
            if (!verifiedPassword) {
                throw new Error('Your password is incorrect')
            }
            return Helper.successMessage(res, contractor);
        } catch (e) {
            console.log(e)
            return Helper.errorMessage(res, e.message);
        }
    }

    async resetPasswordOtpRequest(req, res) {
        const session = req.dbSession
        try {
            const phone = req.params.phone
            const body = {
                resetPasswordOtp: Helper.generateOTP(),
                resetPasswordOtpGeneratedAt: new Date().toISOString(),
                isResetPasswordOtpVerified: false
            };
            const contractor = await ContractorRegistration.findOne({ phone }).select('phone countryCode');
            if (contractor) {
                contractor.resetPasswordOtp = body.resetPasswordOtp;
                contractor.resetPasswordOtpGeneratedAt = body.resetPasswordOtpGeneratedAt
                contractor.isResetPasswordOtpVerified = false
                await contractor.save({ session });
            } else {
                await new ContractorRegistration(body).save({ session });
            }
            // Send Twilio sms
            body.phone = contractor.countryCode + contractor.phone
            await TwilioHelper.sendMessage(body.phone, resetPasswordOtpSms(body.resetPasswordOtp));
            return Helper.successMessage(res, "Reset password otp sent");
        } catch (e) {
            console.log(e)
            return Helper.errorMessage(res, e.message)
        }
    }

    async setPassword(req, res) {
        const session = req.dbSession
        try {
            const body = _.pick(req.body, ['phone', 'resetPasswordOtp', 'password'])
            //compare otp
            const isValidResetPasswordOtp = await ContractorRegistration.findOne({
                phone: body.phone
            }).select('resetPasswordOtp resetPasswordOtpGeneratedAt isResetPasswordOtpVerified');
            const differenceInVerifiedAt = moment().diff(isValidResetPasswordOtp.resetPasswordOtpGeneratedAt, 'minutes')
            if (isValidResetPasswordOtp.resetPasswordOtp !== body.resetPasswordOtp) {
                throw new Error('Invalid otp!')
            };
            if (differenceInVerifiedAt > 5) {
                throw new Error("otp expired")
            }
            if (isValidResetPasswordOtp.isResetPasswordOtpVerified) {
                throw new Error('You have already reset your password, please login')
            }
            //save contractor and generate token
            body.password = Helper.hashString(body.password);
            body.isResetPasswordOtpVerified = true;
            const contractor = await ContractorRegistration.findByIdAndUpdate(isValidResetPasswordOtp._id, body, { new: true }).session(session);
            return Helper.successMessage(res, 'Password successfully reset')
        } catch (e) {
            console.log(e)
            return Helper.errorMessage(res, e.message)
        }
    }

    async verifyEmailAddress(req, res) {
        const session = req.dbSession
        try {
            const { emailToken } = req.params
            const contractor = await ContractorRegistration.findOne({ emailToken }).select('isEmailVerified')
            if (!contractor) {
                throw new Error('Contractor not found!')
            }
            console.log(contractor)
            contractor.isEmailVerified = true
            console.log(contractor)
            await contractor.save({ session })
            return Helper.successMessage(res, 'Email Successfully verified')
        } catch (e) {
            console.log(e)
            return Helper.errorMessage(res, e.message)
        }
    }
}

module.exports = new Auth();