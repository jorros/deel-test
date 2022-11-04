const express = require('express');
const bodyParser = require('body-parser');
const {sequelize} = require('./model')
const app = express();

app.use(bodyParser.json());

app.set('sequelize', sequelize)
app.set('models', sequelize.models)

require('./routes/contracts.route')(app);
require('./routes/jobs.route')(app);

module.exports = app;
