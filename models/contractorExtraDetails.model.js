/* Third Party Libraries */
const path = require('path');
/* Third Party Libraries */

/* Local Files */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { companyType, detailsOfBusinessStatus, healthAndSafetyPolicy, contractStatus } = require('../helpers/constant')
/* Local Files */

let ContractorExtraDetailsSchema = new Schema({
    contractor: {
        type: Schema.Types.ObjectId,
        ref: "ContractorRegistration",
        default: null
    },
    operationDetails: {
        isDocumentedQualityPolicyExists: {
            type: Boolean,
            default: null,
        },
        documents: {
            type: Array,
            default: [],
        },
        isDeliveryPerformanceMeasured: {
            type: Boolean,
            default: null,
        },
        isLateDeliveryNotificationSystemExists: {
            type: Boolean,
            default: null,
        },
        isCustomerQualityPerformanceMeasured: {
            type: Boolean,
            default: null,
        }
    },
    operationExtraDetails: {
        isOperationCertified: {
            type: String,
            default: null,
        },
        supportingDocuments: {
            type: Array,
            default: [],
        },
        qualityManagementPersonFullName: {
            type: String,
            default: null,
        },
        qualityManagementPersonTitle: {
            type: String,
            default: null,
        }
    },
    ehsScreening:{
        healthAndSafetyPolicy: {
            type: Number,
            enum: Object.values(healthAndSafetyPolicy),
            default: null
        },
        healthAndSafetyPolicyDocument: {
            type: Array,
            default: [],
        },
        isAccidentStatisticsDocumentExists: {
            type: Boolean,
            default: false,
        },
        accidentStaticsDocuments: {
            type: Array,
            default: [],
        },
        responsiblePersonFullName: {
            type: String,
            default: null,
        },
        countryCode: {
            type: String,
            default: null,
        },
        responsiblePersonContactNumber: {
            type: String,
            default: null,
        }
    },
    insuranceDetailsScreening:{
        publicLiability: {
            type: Boolean,
            default: null,
        },
        productLiability: {
            type: Boolean,
            default: null,
        },
        employeeLiability: {
            type: Boolean,
            default: null,
        },
        professionalIndemnityInsurance: {
            type: Boolean,
            default: null,
        },
        insuranceDocument: {
            type: Array,
            default: [],
        }
    },
    documentations: {
        isCompanyTradeLicenseLegalDocumentExists: {
            type: Boolean,
            default: null,
        },
        companyTradeLicenseLegalDocuments: {
            type: Array,
            default: [],
        },
        isMnrApprovedLetterExists: {
            type: Boolean,
            default: null,
        },
        mnrApprovedDocument: {
            type: Array,
            default: [],
        },
        isTaxClearanceDocumentExists:{
            type: Boolean,
            default: null
        },
        taxClearanceDocument: {
            type: Array,
            default: [],
        },
        isCompanyBlackListed:{
            type: Boolean,
            default: null
        },
        blackListDocument: {
            type: Array,
            default: [],
        },
        companyBrochureDocument: {
            type: Array,
            default: [],
        }
    },
    reference: [{
        organization: {
            type: String,
            default: null,
        },
        contactPersonName: {
            type: String,
            default: null,
        },
        countryCode: {
            type: String,
            default: null,
        },
        contactNumber: {
            type: String,
            default: null,
        },
        serviceOrContractType: {
            type: String,
            default: null,
        },
        contractStatus:{
            type: Number,
            enum: Object.values(contractStatus),
            default: null
        }
    }],
    acceptanceAndSignature: {
        name: {
            type: String,
            default: null,
        },
        titlePosition: {
            type: String,
            default: null,
        },
        date: {
            type: String,
            default: null,
        },
        signature: {
            type: String,
            default: null,
        },
    }
}, {
    timestamps: true
});



module.exports = mongoose.model("ContractorExtraDetails", ContractorExtraDetailsSchema);
