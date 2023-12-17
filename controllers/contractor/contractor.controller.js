/* Libraries*/
const _ = require("lodash");
/* End Libraries*/

/* Models*/
const ContractorRegistration = require("../../models/contractorRegistration.model");
const ContractorDetails = require("../../models/contractorDetails.model");
const ContractorExtraDetails = require("../../models/contractorExtraDetails.model");
const ContractorExtraDetailsModel = require("../../models/contractorExtraDetails.model");
/* End Models*/

/* Helpers */
const Helper = require("../../helpers/helper");
const {
  postContactorDetailsFields,
  postContractorExtraDetailsFields,
  referenceFields,
} = require("../../helpers/fields.helper");
const mailHelper = require("../../helpers/mail.helper");

/* End Helpers */

class Contractor {
  async postContactorDetails(req, res) {
    const session = req.dbSession;
    const contractor = req.contractor;
    try {
      const body = _.pick(req.body, postContactorDetailsFields);
      const details = await ContractorDetails.findOne({
        contractor: contractor._id,
      });

      let updatedContractorDetails;
      if (details) {
        updatedContractorDetails = await ContractorDetails.findByIdAndUpdate(
          details._id,
          body,
          { new: true }
        )
          .populate("detailsOfBusiness.services", "serviceId serviceName")
          .session(session);
      } else {
        body.contractor = contractor._id;
        const data = await new ContractorDetails(body).save({ session });
        updatedContractorDetails = await data.populate(
          "detailsOfBusiness.services",
          "serviceId serviceName"
        );
      }
      return Helper.successMessage(res, updatedContractorDetails);
    } catch (e) {
      console.log(e);
      return Helper.errorMessage(res, e.message);
    }
  }

  async getContractorDetails(req, res) {
    const contractor = req.contractor;
    console.log(contractor);
    try {
      const contractorDetails = await ContractorDetails.findOne({
        contractor: contractor._id,
      }).populate("detailsOfBusiness.services", "serviceId serviceName");
      return Helper.successMessage(
        res,
        contractorDetails ? contractorDetails : {}
      );
    } catch (e) {
      console.log(e);
      return Helper.errorMessage(res, e.message);
    }
  }

  async postContractorExtraDetails(req, res) {
    const session = req.dbSession;
    const contractor = req.contractor;
    try {
      const body = _.pick(req.body, postContractorExtraDetailsFields);
      console.log(body);
      const details = await ContractorExtraDetails.findOne({
        contractor: contractor._id,
      });
      if (body.reference) {
        body.reference = body.reference.map((item) =>
          _.pick(item, referenceFields)
        );
      }
      let updatedContractorExtraDetails;
      if (details) {
        updatedContractorExtraDetails =
          await ContractorExtraDetails.findByIdAndUpdate(details._id, body, {
            new: true,
          }).session(session);
      } else {
        body.contractor = contractor._id;
        updatedContractorExtraDetails = await new ContractorExtraDetails(
          body
        ).save({ session });
      }
      // send welcome email
      if (updatedContractorExtraDetails.acceptanceAndSignature.signature) {
        await mailHelper.sendWelcomeEmail(contractor.email, contractor.fullName);
        await Helper.completeContractorOnboard(contractor);
      }
      return Helper.successMessage(res, updatedContractorExtraDetails);
    } catch (e) {
      console.log(e);
      return Helper.errorMessage(res, e.message);
    }
  }

  async getContractorExtraDetails(req, res) {
    const contractor = req.contractor;
    try {
      const contractorExtraDetails = await ContractorExtraDetails.findOne({
        contractor: contractor._id,
      });
      return Helper.successMessage(
        res,
        contractorExtraDetails ? contractorExtraDetails : {}
      );
    } catch (e) {
      console.log(e);
      return Helper.errorMessage(res, e.message);
    }
  }

  async getContractor(req, res) {
    const contractor = req.contractor;
    try {
      const data = await ContractorRegistration.findById(contractor._id).select(
        "-otp -otpGeneratedAt"
      );
      if (!data) {
        throw new Error("Contractor not found!");
      }
      return Helper.successMessage(res, data);
    } catch (e) {
      console.log(e);
      return Helper.errorMessage(res, e.message);
    }
  }

  async changePassword(req, res) {
    const session = req.dbSession;
    const contractor = req.contractor;
    try {
      const body = _.pick(req.body, ["oldPassword", "newPassword"]);
      const contractorForPassword = await ContractorRegistration.findById(
        contractor._id
      ).select("+password");
      const verifiedPassword = Helper.compareHashedString(
        body.oldPassword,
        contractorForPassword.password
      );
      if (!verifiedPassword) {
        throw new Error("Your old password is incorrect");
      }
      contractorForPassword.password = Helper.hashString(body.newPassword);
      await contractorForPassword.save({ session });
      return Helper.successMessage(res, "Password changed successfully");
    } catch (e) {
      console.log(e);
      return Helper.errorMessage(res, e.message);
    }
  }

  async updateContractorRegistrationDetails(req, res) {
    const session = req.dbSession;
    const contractor = req.contractor;
    try {
      const body = _.pick(req.body, ["fullName", "companyName", "companyLogo"]);
      const contractorRegistration =
        await ContractorRegistration.findByIdAndUpdate(
          contractor._id,
          {
            body,
          },
          {
            new: true,
          }
        )
          .select(
            "fullName userName companyName companyLogo countryCode phone email"
          )
          .session(session);
      return Helper.successMessage(res, contractorRegistration);
    } catch (e) {
      console.log(e);
      return Helper.errorMessage(res, e.message);
    }
  }

  async getContractorUploadedDocuments(req, res) {
    const contractor = req.contractor;
    const session = req.dbSession;
    try {
      const contractorDetail = await ContractorDetails.findOne({
        contractor,
      }).select("detailsOfBusiness.documents createdAt");
      const contractorExtraDetail = await ContractorExtraDetailsModel.findOne({
        contractor,
      }).select(
        "operationDetails.documents  operationExtraDetails.supportingDocuments  ehsScreening.healthAndSafetyPolicyDocument ehsScreening.accidentStaticsDocuments insuranceDetailsScreening.insuranceDocument documentations.companyTradeLicenseLegalDocuments documentations.isMnrApprovedLetterExists documentations.companyBrochureDocument createdAt"
      );
      const data = {
        contractorDetail,
        contractorExtraDetail,
      };
      return Helper.successMessage(res, data);
    } catch (e) {
      console.log(e);
      return Helper.errorMessage(res, e.message);
    }
  }
}

module.exports = new Contractor();
