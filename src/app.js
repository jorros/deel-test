const express = require('express');
const bodyParser = require('body-parser');
const {handleError} = require("./middleware/handleError.middleware");
const app = express();

app.use(bodyParser.json());

require('./routes/contracts.route')(app);
require('./routes/jobs.route')(app);
require('./routes/balances.route')(app);
require('./routes/admin.route')(app);

app.use(handleError);

module.exports = app;
