/* Third Party Libraries */
const bcrypt = require("bcrypt");
/* End Third Party Libraries */

const ContractorRegistration = require("../models/contractorRegistration.model");

class Helper {
  successMessage(res, data = null) {
    res.status(200).json({
      status: "success",
      response: data ? data : "Request process successfully",
    });
  }

  errorMessage(res, error = null) {
    res.status(422).json({
      status: "fail",
      errorResponse: {
        error: error ? error : "Something went wrong",
      },
    });
  }

  authErrorMessage(res, data = null) {
    return res.status(401).json({
      status: "fail",
      response: "Unauthorized",
    });
  }

  validationErrorMessage(res, error = null) {
    console.log(error);
    return res.status(422).json({
      status: "fail",
      errorResponse: {
        error: error ? error : "Invalid Parameters",
      },
    });
  }

  generateOTP(min = 100000, max = 999999) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  hashString(string) {
    let saltRounds = 10;
    return bcrypt.hashSync(string, saltRounds);
  }

  compareHashedString(newString, originalString) {
    return bcrypt.compareSync(newString, originalString);
  }

  strongPassword(value) {
    const regex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{":;'?/>.<,])(?!.*\s).{8,}$/;
    if (!regex.test(value)) {
      throw new Error(
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character"
      );
    }
    return true;
  }

  generateAcronym(phrase) {
    const words = phrase.split(" ");
    const letters = words.map((word) => {
      const firstLetter = word[0];
      return firstLetter.match(/[A-Za-z]/) ? firstLetter.toUpperCase() : "";
    });
    const number = Math.floor(Math.random() * 1000000);
    return `${letters.join("")}${number}`;
  }

  async completeContractorOnboard(contractor) {
    try {
      await ContractorRegistration.findByIdAndUpdate(
        contractor._id,
        {
          isOnboardCompleted: true,
        },
        {
          new: true,
        }
      );
    } catch (e) {
      throw e;
    }
  }
}

module.exports = new Helper();
