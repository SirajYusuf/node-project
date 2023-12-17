/* Third Party Libraries */
const express = require("express");
const Route = express.Router();
/* End Third Party Libraries */

/** Local files */
const upload = require('../config/fileUpload');
/** End local files */

/** Controllers */
const AuthController = require('../controllers/contractor/auth.controller');
const FilesController = require('../controllers/files.controller');
/** End Controllers */

/** Validations */
const AuthValidations = require('../validations/auth.validation')
const {validate} = require('../middlewares/validate.middleware')
/** End Validations */

/** Contractor Auth Routes */
Route.post("/contractor/send-otp",  AuthValidations.validateSendOtp(), validate, AuthController.postSendOtp)
Route.post("/contractor/register", AuthValidations.validateRegister(), validate, AuthController.postRegister);
Route.post("/contractor/login", AuthValidations.validateLogin(), validate , AuthController.postLogin);
Route.get("/contractor/forgot-password/:phone", AuthValidations.validateResetPasswordOtpRequest(), validate , AuthController.resetPasswordOtpRequest);
Route.post("/contractor/set-password", AuthValidations.validateResetPassword(), validate , AuthController.setPassword);
Route.get("/verify-email/:emailToken", AuthController.verifyEmailAddress)
/** End Contractor Auth Routes */

/** File Routes */
Route.post('/upload/files',
    upload.files(FilesController.expectedFiles()),
    FilesController.uploadFiles
)
/** End File Routes */

module.exports =  Route;