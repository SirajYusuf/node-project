/* Third Party Libraries */
const path = require('path');
/* Third Party Libraries */

/* Local Files */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { companyType, detailsOfBusinessStatus, currencyForCompanyValuation } = require('../helpers/constant')
/* Local Files */

let ContractorDetails = new Schema({
    contractor: {
        type: Schema.Types.ObjectId,
        ref: "ContractorRegistration",
        default: null
    },
    companyInformation: {
        companyName: {
            type: String,
            default: null,
        },
        companyId:{
            type: String,
            default: null
        },
        companyType: {
            type: Number,
            enum: Object.values(companyType),
            default: null
        },
        companyLogo: {
            type: String,
            default: null,
        },
        countryCode: {
            type: String,
            default: null,
        },
        companyContactNumber: {
            type: String,
            default: null,
        },
        faxNumber: {
            type: String,
            default: null,
        },
        companyEmail: {
            type: String,
            default: null,
        },
        companyWebsite: {
            type: String,
            default: null,
        },
        companyAddress: {
            type: String,
            default: null,
        },
        zip: {
            type: String,
            default: null,
        },
        city: {
            type: String,
            default: null,
        },
        state: {
            type: String,
            default: null,
        },
        country: {
            type: String,
            default: null,
        },
    },
    parentCompanyInformation: {
        isSubsidiaryOfAnotherCompany: {
            type: Boolean,
            default: true,
        },
        parentCompanyName: {
            type: String,
            default: null,
        },
        parentCompanyFoundedYear: {
            type: String,
            default: null,
        },
        parentCompanyChairmanName: {
            type: String,
            default: null,
        },
        parentCompanyCeoName: {
            type: String,
            default: null,
        },
        countryCode: {
            type: String,
            default: null,
        },
        ParentCompanyContactNumber: {
            type: String,
            default: null,
        },
        ParentCompanyWebsite: {
            type: String,
            default: null,
        },
        parentCompanyAddress: {
            type: String,
            default: null,
        },
        zip: {
            type: String,
            default: null,
        },
        city: {
            type: String,
            default: null,
        },
        state: {
            type: String,
            default: null,
        },
        country: {
            type: String,
            default: null,
        },
    },
    detailsOfBusiness: {
        natureOfBusiness: {
            type: String,
            default: null,
        },
        typeOfBusiness: {
            type: String,
            default: null,
        },
        services: [
            {
                type: Schema.Types.ObjectId,
                ref: "Service",
                default: null
            },
        ],
        companyValuation: {
            type: String,
            default: null,
        },
        currency: {
            type: Number,
            enum: Object.values(currencyForCompanyValuation),
            default: null
        },
        scopeOfService: {
            type: String,
            default: null,
        },
        specialty: {
            type: String,
            default: null,
        },
        yearsInBusiness: {
            type: String,
            default: null,
        },
        status: {
            type: Number,
            enum: Object.values(detailsOfBusinessStatus),
            default: null
        },
        classification: {
            type: String,
            default: null,
        },
        isSubsidiaryOfAnotherCompany: {
            type: Boolean,
            default: true,
        },
        numberOfBranches: {
            type: Number,
            default: null,
        },
        numberOfEmployees: {
            type: Number,
            default: null,
        },
        documents: {
            type: Array,
            default: [],
        }
    },
    bankDetails:{
        bankName:{
            type: String,
            default: null,
        },
        accountHolderName:{
            type: String,
            default: null,
        },
        accountNumber:{
            type: String,
            default: null,
        },
        routingNumber:{
            type: String,
            default: null,
        },
        ibanOrSwiftCode:{
            type: String,
            default: null,
        },
    }
}, {
    timestamps: true
});



module.exports = mongoose.model("ContractorDetails", ContractorDetails);
