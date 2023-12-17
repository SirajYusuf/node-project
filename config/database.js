require('dotenv').config();
const mongoose = require("mongoose");
const env = process.env;
let connection = env.MONGODB_URL;
if (env.DB_SRV && env.DB_SRV != '') {
    connection = env.DB_SRV
}

mongoose.connect(connection, {
    useNewUrlParser: true,
    // useFindAndModify: false,
    // useCreateIndex: true,
    useUnifiedTopology: true
});

mongoose.connection.on('error', () => console.log);
mongoose.connection.on('open', () => console.log("Connected to mongo server."));

mongoose.Promise = Promise;

module.exports = {
    mongoose,
    connection
};