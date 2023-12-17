/* Third Party Libraries */
const express = require("express");
const Route = express.Router();
/* End Third Party Libraries */

/** Controllers */
const ContractorController = require('../../controllers/contractor/contractor.controller')
/** End Controllers */

/** Validations */
const ContractorValidations = require('../../validations/contractor.validation');
const ServiceController = require("../../controllers/contractor/service.controller");
/** End Validations */

/** MiddleWare */
const authMiddle = require("../../middlewares/auth.middleware");
const { validate } = require("../../middlewares/validate.middleware");
const FilesController = require("../../controllers/files.controller");
/** MiddleWare */

/** Non-authorized routes */
Route.post('/contractor/service/add-services', ServiceController.addServices)
/** End Non-authorized routes */

Route.use(authMiddle.auth);
/** Contractor Authorized Routes */
Route.get('/contractor', ContractorController.getContractor)
Route.post('/contractor/change-password', ContractorValidations.validateChangePassword(), validate, ContractorController.changePassword)
Route.post('/contractor/update', ContractorValidations.validateUpdateContractorRegistrationDetails(), validate, ContractorController.updateContractorRegistrationDetails)

Route.post('/contractor/details', ContractorValidations.validatePostContactorDetails(), validate, ContractorController.postContactorDetails);
Route.get('/contractor/details', ContractorController.getContractorDetails);

Route.post('/contractor/extra-details', ContractorValidations.validatePostContractorExtraDetails(), validate, ContractorController.postContractorExtraDetails);
Route.get('/contractor/extra-details', ContractorController.getContractorExtraDetails);
Route.get('/contractor/documents', ContractorController.getContractorUploadedDocuments)
/** End Contractor Authorized routes */

/** Service Routes */
Route.get('/contractor/services', ServiceController.getServices);
/** End Service Routes */

/** FIle Routes */
Route.post('/files/retrieve', FilesController.retrieveFiles);
/** End FIle Routes */
/** End Contractor Auth Routes */


module.exports =  Route;