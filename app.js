/** Third-party Libraries */
const express = require('express')
require('./config/database')
const cors = require("cors");
/** End Third-party Libraries */
const port = process.env.PORT || 3000

/** Local Files */
const authRouter = require("./routes/auth.route");
const contractorRouter = require("./routes/api/contractor.route");
const { transaction } = require('./middlewares/dbSession.middleware')
/** End Local Files */

const app = express()

app.use(cors());
app.use(express.json())
app.use(transaction);

//log request url
app.use((req, res, next) => {
    console.log(req.originalUrl);
    next();
});

app.use('/auth', authRouter);
app.use('/api', contractorRouter);

app.get('/', (req, res) => {
    res.send('App is up and running')
})

// port listening
app.listen(port, () => {
    console.log('Server is up on port ' + port)
})
