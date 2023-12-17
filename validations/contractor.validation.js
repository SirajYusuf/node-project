/* Libraries*/
const {
    check,
    validationResult,
    body
} = require("express-validator");
const bodyValidator = require("express-validator").body;
/* End Libraries*/

/* Models*/
/* End Models*/

/* Helpers */
const Helper = require('../helpers/helper')
const isStrongPassword = Helper.strongPassword
const { companyType, detailsOfBusinessStatus, healthAndSafetyPolicy } = require('../helpers/constant')
const { checkIdInModel } = require("../helpers/model.helper");
/* End Helpers */

class ContractorDetailsValidation {
    validateChangePassword() {
        return [
            bodyValidator(["oldPassword"]).exists().withMessage('Please enter your old password'),
            bodyValidator(["newPassword"]).exists().withMessage('Please enter your new password').custom(isStrongPassword),
        ]
    }

    validatePostContactorDetails() {
        return [
            /** Company Information validations */
            bodyValidator(['companyInformation']).optional().isObject()
                .withMessage('company information must be object'),
            bodyValidator(['companyInformation.companyName']).if(body('companyInformation').exists())
                .exists().withMessage('Company name is required'),
            bodyValidator(['companyInformation.companyType']).if(body('companyInformation').exists())
                .exists().withMessage('Company type is required').isIn(Object.values(companyType))
                .withMessage(`Company type must be in 1 or 2`),
            bodyValidator(['companyInformation.companyLogo']).optional(),
            bodyValidator(['companyInformation.countryCode']).if(body('companyInformation').exists())
                .exists().withMessage('Please select the country code for contact number'),
            bodyValidator(['companyInformation.companyContactNumber']).if(body('companyInformation').exists())
                .exists().withMessage('Company contact number is required')
                .isMobilePhone().withMessage('Invalid contact number'),
            bodyValidator(['companyInformation.faxNumber']).optional(),
            bodyValidator(['companyInformation.companyEmail']).if(body('companyInformation').exists())
                .exists().withMessage('Company email is required').isEmail().withMessage('Invalid company email').normalizeEmail(),
            bodyValidator(['companyInformation.companyWebsite']).optional(),
            bodyValidator(['companyInformation.companyAddress']).if(body('companyInformation').exists())
                .exists().withMessage('Company address is required'),
            bodyValidator(['companyInformation.zip']).if(body('companyInformation').exists())
                .exists().withMessage('zip is required'),
            bodyValidator(['companyInformation.city']).if(body('companyInformation').exists())
                .exists().withMessage('city is required'),
            bodyValidator(['companyInformation.state']).if(body('companyInformation').exists())
                .exists().withMessage('state is required'),
            bodyValidator(['companyInformation.country']).if(body('companyInformation').exists())
                .exists().withMessage('state is required'),
            /** End Company Information validations */
            /** Parent Company Information validations */
            bodyValidator(['parentCompanyInformation']).optional().isObject()
                .withMessage('Parent Company information must be object'),
            bodyValidator(['parentCompanyInformation.isSubsidiaryOfAnotherCompany']).if(body('parentCompanyInformation').exists())
                .exists().withMessage('Please indicate if your company is a subsidiary of another company.').isBoolean(),
            bodyValidator(['parentCompanyInformation.parentCompanyName'])
                .if(body('parentCompanyInformation.isSubsidiaryOfAnotherCompany').equals('true'))
                .exists().withMessage('Parent company name is required'),
            bodyValidator(['parentCompanyInformation.parentCompanyFoundedYear'])// have some doubt regarding this <-----------
                .if(body('parentCompanyInformation.isSubsidiaryOfAnotherCompany').equals('true'))
                .exists().withMessage('Founded year is required'),
            bodyValidator(['parentCompanyInformation.parentCompanyChairmanName'])
                .if(body('parentCompanyInformation.isSubsidiaryOfAnotherCompany').equals('true'))
                .exists().withMessage('Parent company chairman name is required'),
            bodyValidator(['parentCompanyInformation.parentCompanyCeoName'])
                .if(body('parentCompanyInformation.isSubsidiaryOfAnotherCompany').equals('true'))
                .exists().withMessage('Parent company ceo name is required'),
            bodyValidator(['parentCompanyInformation.countryCode'])
                .if(body('parentCompanyInformation.isSubsidiaryOfAnotherCompany').equals('true'))
                .exists().withMessage('Please select the country code for contact number'),
            bodyValidator(['parentCompanyInformation.ParentCompanyContactNumber'])
                .if(body('parentCompanyInformation.isSubsidiaryOfAnotherCompany').equals('true'))
                .exists().withMessage('Parent company contact number is required')
                .isMobilePhone().withMessage('Invalid contact number'),
            bodyValidator(['parentCompanyInformation.ParentCompanyWebsite'])
                .if(body('parentCompanyInformation.isSubsidiaryOfAnotherCompany').equals('true'))
                .exists().withMessage('Parent company website is required'),
            bodyValidator(['parentCompanyInformation.parentCompanyAddress'])
                .if(body('parentCompanyInformation.isSubsidiaryOfAnotherCompany').equals('true'))
                .exists().withMessage('Parent company address is required'),
            bodyValidator(['parentCompanyInformation.zip'])
                .if(body('parentCompanyInformation.isSubsidiaryOfAnotherCompany').equals('true'))
                .exists().withMessage('zip is required'),
            bodyValidator(['parentCompanyInformation.city'])
                .if(body('parentCompanyInformation.isSubsidiaryOfAnotherCompany').equals('true'))
                .exists().withMessage('city is required'),
            bodyValidator(['parentCompanyInformation.state'])
                .if(body('parentCompanyInformation.isSubsidiaryOfAnotherCompany').equals('true'))
                .exists().withMessage('state is required'),
            bodyValidator(['parentCompanyInformation.country'])
                .if(body('parentCompanyInformation.isSubsidiaryOfAnotherCompany').equals('true'))
                .exists().withMessage('country is required'),
            /**End Parent Company Information validations */
            /** Details of business validations */
            bodyValidator(['detailsOfBusiness']).optional().isObject()
                .withMessage('details of business must be object'),
            bodyValidator(['detailsOfBusiness.natureOfBusiness']).if(body('detailsOfBusiness').exists())
                .exists().withMessage('Nature of business is required'),
            bodyValidator(['detailsOfBusiness.typeOfBusiness']).if(body('detailsOfBusiness').exists())
                .exists().withMessage('Type of business is required'),
            bodyValidator(['detailsOfBusiness.services']).if(body('detailsOfBusiness').exists())
                .exists().withMessage('Please select one or more services').isArray()
                .withMessage('Services must be array').isArray({ min: 1 }).withMessage('Please select at least one or more services')
                .custom(checkIdInModel({ model: 'Service' })),
            bodyValidator(['detailsOfBusiness.scopeOfService']).if(body('detailsOfBusiness').exists())
                .exists().withMessage('Scope of services is required'),
            bodyValidator(['detailsOfBusiness.specialty']).if(body('detailsOfBusiness').exists())
                .exists().withMessage('Specialty is required'),
            bodyValidator(['detailsOfBusiness.yearsInBusiness']).if(body('detailsOfBusiness').exists())
                .exists().withMessage('Years in business is required').isNumeric().withMessage('Years in business cannot be a string')
                .not().isString().withMessage('Years in business must be a number'),
            bodyValidator(['detailsOfBusiness.status']).if(body('detailsOfBusiness').exists())
                .exists().withMessage('Nature of business is required').isIn(Object.values(detailsOfBusinessStatus))
                .withMessage('Status must be either 1 or 2'),
            bodyValidator(['detailsOfBusiness.classification']).if(body('detailsOfBusiness').exists())
                .exists().withMessage('Classification is required'),
            bodyValidator(['detailsOfBusiness.isSubsidiaryOfAnotherCompany']).if(body('detailsOfBusiness').exists())
                .exists().withMessage('Please indicate if your company is a subsidiary of another company.')
                .isBoolean().withMessage('isSubsidiaryOfAnotherCompany field must be boolean'),
            bodyValidator(['detailsOfBusiness.numberOfBranches']).if(body('detailsOfBusiness').exists())
                .exists().withMessage('Please specify the total number of branches.').isNumeric()
                .withMessage('Amount of branches must be a number').not().isString().withMessage('Amount of branches cannot be a string'),
            bodyValidator(['detailsOfBusiness.numberOfEmployees']).if(body('detailsOfBusiness').exists())
                .exists().withMessage('Please specify the total number of employees').isNumeric()
                .withMessage('Amount of employees must be a number').not().isString().withMessage('Amount of employees cannot be a string'),
            bodyValidator(['detailsOfBusiness.documents']).if(body('detailsOfBusiness').exists())
                .exists().withMessage('Document is required').isArray()
                .withMessage('Document must be array').isArray({ min: 1 }).withMessage('Please provide at least one or more documents'),
            /** End Details of business validations */
        ]
    }

    validatePostContractorExtraDetails() {
        return [
            /** Operation Details Validations */
            bodyValidator(['operationDetails']).optional().isObject()
                .withMessage('Operation details must be object'),
            bodyValidator(['operationDetails.isDocumentedQualityPolicyExists']).if(body('operationDetails').exists())
                .exists().withMessage('Please Specify if you have a documented quality policy and procedures')
                .isBoolean().withMessage('isDocumentedQualityPolicyExists must be boolean'),
            bodyValidator(['operationDetails.documents']).if(body('operationDetails.isDocumentedQualityPolicyExists').equals('true'))
                .exists().withMessage('Please provide document of quality policy').isArray().withMessage('Document must be array')
                .isArray({ min: 1 }).withMessage('Please provide at least one or more documents'),
            bodyValidator(['operationDetails.isDeliveryPerformanceMeasured']).if(body('operationDetails').exists())
                .exists().withMessage('Please Specify if you measure delivery performance')
                .isBoolean().withMessage('isDeliveryPerformanceMeasured must be boolean'),
            bodyValidator(['operationDetails.isLateDeliveryNotificationSystemExists']).if(body('operationDetails').exists())
                .exists().withMessage('Please Specify if you have notification system for missed / late delivery')
                .isBoolean().withMessage('isLateDeliveryNotificationSystemExists must be boolean'),
            bodyValidator(['operationDetails.isCustomerQualityPerformanceMeasured']).if(body('operationDetails').exists())
                .exists().withMessage('Please Specify if you measure quality performance')
                .isBoolean().withMessage('isCustomerQualityPerformanceMeasured must be boolean'),
            /** End Operation Details Validations */
            /** Operation Extra Details Validations */
            bodyValidator(['operationExtraDetails']).optional().isObject()
                .withMessage('Operation details must be object'),
            bodyValidator(['operationExtraDetails.isOperationCertified']).if(body('operationExtraDetails').exists())
                .exists().withMessage('Please indicate if your operations are certified by a recognized Quality System.'),
            bodyValidator(['operationExtraDetails.supportingDocuments']).if(body('operationExtraDetails.isOperationCertified').exists())
                .exists().withMessage('Please provide one or more supporting documents').isArray().withMessage('Document must be array')
                .isArray({ min: 1 }).withMessage('Please provide at least one or more documents'),
            bodyValidator(['operationExtraDetails.qualityManagementPersonFullName']).if(body('operationExtraDetails').exists())
                .exists().withMessage('Quality management person full name is required'),
            bodyValidator(['operationExtraDetails.qualityManagementPersonTitle']).if(body('operationExtraDetails').exists())
                .exists().withMessage('Quality management person title is required'),
            /** Operation Extra Details Validations */
            /** Screening Validations */
            /** EHS validations */
            bodyValidator(['ehsScreening']).optional().isObject()
                .withMessage('ehsScreening must be object'),
            bodyValidator(['ehsScreening.healthAndSafetyPolicy']).if(body('ehsScreening').exists())
                .exists().withMessage('Please specify if  you have documented Health and Safety policy').isIn(Object.values(healthAndSafetyPolicy))
                .withMessage('healthAndSafetyPolicy must be either 1, 2 or 3'),
            bodyValidator(['ehsScreening.healthAndSafetyPolicyDocument']).if(body('ehsScreening.healthAndSafetyPolicy')
                .isIn([healthAndSafetyPolicy.INPROGRESS, healthAndSafetyPolicy.YES]))
                .exists().withMessage('Health and safety policy document is required').isArray()
                .withMessage('Document must be array').isArray({ min: 1 }).withMessage('Please provide at least one or more documents'),
            bodyValidator(['ehsScreening.isAccidentStatisticsDocumentExists']).if(body('ehsScreening').exists())
                .exists().withMessage('Please specify if you keep accident statistics')
                .isBoolean().withMessage('isAccidentStatisticsDocumentExists must be boolean'),
            bodyValidator(['ehsScreening.accidentStaticsDocuments']).if(body('ehsScreening.isAccidentStatisticsDocumentExists').equals('true'))
                .exists().withMessage('Accident statistic document is required').isArray()
                .withMessage('Document must be array').isArray({ min: 1 }).withMessage('Please provide at least one or more documents'),
            bodyValidator(['ehsScreening.responsiblePersonFullName']).if(body('ehsScreening').exists())
                .exists().withMessage('Please specify the person\'s full name who is responsible for EHS issues and performance.')
                .isString().withMessage('responsiblePersonFullName must be a string').notEmpty().withMessage('responsiblePersonFullName is required'),
            bodyValidator(['ehsScreening.countryCode']).if(body('ehsScreening').exists())
                .exists().withMessage('Please select the country code for contact number.'),
            bodyValidator(['ehsScreening.responsiblePersonContactNumber']).if(body('ehsScreening').exists())
                .exists().withMessage('Please specify the responsible person\'s contact number.')
                .isMobilePhone().withMessage('Invalid contact number'),
            /** End EHS validations */
            /** Insurance Details validations */
            bodyValidator(['insuranceDetailsScreening']).optional().isObject()
                .withMessage('insuranceDetailsScreening details must be object'),
            bodyValidator(['insuranceDetailsScreening.publicLiability']).if(body('insuranceDetailsScreening').exists())
                .exists().withMessage('Please indicate if you have Public Liability / General Third Party Liability')
                .isBoolean().withMessage('publicLiability must be boolean'),
            bodyValidator(['insuranceDetailsScreening.productLiability']).if(body('insuranceDetailsScreening').exists())
                .exists().withMessage('Please indicate if you have Product Liability')
                .isBoolean().withMessage('productLiability must be boolean'),
            bodyValidator(['insuranceDetailsScreening.employeeLiability']).if(body('insuranceDetailsScreening').exists())
                .exists().withMessage('Please indicate if you have Employee Liability')
                .isBoolean().withMessage('employeeLiability must be boolean'),
            bodyValidator(['insuranceDetailsScreening.professionalIndemnityInsurance']).if(body('insuranceDetailsScreening').exists())
                .exists().withMessage('Please indicate if you have Professional Indemnity Insurance')
                .isBoolean().withMessage('professionalIndemnityInsurance must be boolean'),
            bodyValidator(['insuranceDetailsScreening.insuranceDocument'])
                .optional().isArray().withMessage('Document must be array').isArray({ min: 1 })
                .withMessage('Please provide at least one or more documents'),
            /** End Insurance Details validations */
            /** End Screening Validations */
            /** Documentations validations */
            bodyValidator(['documentations']).optional().isObject()
                .withMessage('documentations must be object'),
            bodyValidator(['documentations.isCompanyTradeLicenseLegalDocumentExists']).if(body('documentations').exists())
                .exists().withMessage('Please specify if you have legal document of your company\'s Trade license')
                .isBoolean().withMessage('isCompanyTradeLicenseLegalDocumentExists must be boolean'),
            bodyValidator(['documentations.companyTradeLicenseLegalDocuments'])
                .if(body('documentations.isCompanyTradeLicenseLegalDocumentExists').equals('true'))
                .exists().withMessage('Please upload the legal document of your company\'s Trade license')
                .isArray().withMessage('Document must be array').isArray({ min: 1 })
                .withMessage('Please provide at least one or more documents'),
            bodyValidator(['documentations.isMnrApprovedLetterExists']).if(body('documentations').exists())
                .exists().withMessage('Please specify if you have a MNR approved letter for your company')
                .isBoolean().withMessage('isMnrApprovedLetterExists must be boolean'),
            bodyValidator(['documentations.mnrApprovedDocument'])
                .if(body('documentations.isMnrApprovedLetterExists').equals('true'))
                .exists().withMessage('Please upload your company\'s MNR approved letter ')
                .isArray().withMessage('Document must be array').isArray({ min: 1 })
                .withMessage('Please provide at least one or more documents'),
            bodyValidator(['documentations.companyBrochureDocument'])
                .optional().isArray().withMessage('Document must be array')
                .isArray({ min: 1 }).withMessage('Please provide at least one or more documents'),
            /** End Documentations validations */
            /** References validations */
            bodyValidator(['reference']).optional().isArray()
                .withMessage('documentations must be array').isArray({ min: 1 })
                .withMessage('Please provide at least one or more references'),
            bodyValidator(['reference.*.organization']).exists()
                .withMessage('organization is required'),
            bodyValidator(['reference.*.contactPersonName']).exists()
                .withMessage('Contact Person Name is required'),
            bodyValidator(['reference.*.countryCode']).exists()
                .withMessage('Please select country code for your contact number'),
            bodyValidator(['reference.*.contactNumber']).exists()
                .isMobilePhone().withMessage('Invalid contact number')
                .withMessage('Contact number is required'),
            bodyValidator(['reference.*.serviceOrContractType']).exists()
                .withMessage('Service or contract type is required'),
            /** End Reference validations */
            /** Acceptance and Signature validations */
            bodyValidator(['acceptanceAndSignature']).optional().isObject()
                .withMessage('acceptanceAndSignature must be object'),
            bodyValidator(['acceptanceAndSignature.name']).if(body('acceptanceAndSignature').exists())
                .exists().withMessage('Name is required'),
            bodyValidator(['acceptanceAndSignature.titlePosition']).if(body('acceptanceAndSignature').exists())
                .exists().withMessage('Title position is required'),
            bodyValidator(['acceptanceAndSignature.date']).if(body('acceptanceAndSignature').exists())
                .exists().withMessage('Date is required'),
            bodyValidator(['acceptanceAndSignature.signature']).if(body('acceptanceAndSignature').exists())
                .exists().withMessage('Signature is required'),
            /** End Acceptance and Signature validations */
        ]
    }

    validateUpdateContractorRegistrationDetails() {
        return [
            bodyValidator(["fullName"]).exists().withMessage('Full name is required'),
            bodyValidator(["companyName"]).exists().withMessage('Company name is required'),
            bodyValidator(["companyLogo"]).exists().withMessage('Please add your company logo'),
        ]
    }
}

module.exports = new ContractorDetailsValidation();