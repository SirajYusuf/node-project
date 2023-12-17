module.exports = {
    registrationOtpSms: (otp, companyName) => `Dear customer, use this One Time Password ${otp} to signup to your ${companyName} account. This OTP will be valid for the next 5 mins.`,
    resetPasswordOtpSms: (otp) => `Dear customer, the one time password (OTP) to reset your password is ${otp}. This OTP will expire in 5 minutes.`
}