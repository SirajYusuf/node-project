/* Third Party Libraries */
const path = require('path');
/* Third Party Libraries */

/* Local Files */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/* Local Files */

let ServiceModel = new Schema({
    serviceId: {
        type: String,
        default: null
    },
    serviceName: {
        type: String,
        default: null
    },
}, {
    timestamps: true
});



module.exports = mongoose.model("Service", ServiceModel);
