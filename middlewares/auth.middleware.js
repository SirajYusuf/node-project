require('dotenv');
/* Helpers */
const Helper = require("../helpers/helper");
/* End Helpers*/

/* Models*/
const ContractorRegistration = require("../models/contractorRegistration.model")
/* End Models*/

class ApiMiddleware {

    async auth(req, res, next) {
        try {
            const token = req.header("authorization").split(' ')[1];
            const contractor = await ContractorRegistration.findByToken(token);
            if (!contractor) {
                throw new Error("unauthorized");
            }
            // need to add isEmailVerified
            if (!contractor.isOtpVerified) {
                throw new Error("Contractor's contact number not verified");
            }
            if (!contractor.isEmailVerified) {
                throw new Error("Contractor's email address not verified");
            }
            req.contractor = contractor;
            next();
        } catch (e) {
            console.log(e, 'IN API auth middleware')
            return Helper.authErrorMessage(res, e ? e.message : "unauthorized");
        }
    }

}

module.exports = new ApiMiddleware();