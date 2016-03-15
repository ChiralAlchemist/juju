var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var cron = require('./cronJobs.js')
var app = express();
var router = express.Router();
var scrapeTools = require('./scraping.js');

require('./config/middleware.js')(app, express);

var port = process.env.PORT || 3000;

app.post('/scrape',scrapeTools.scrape);
// app.config('test', function(){
//     port = 3002;
// });

app.listen(port);

console.log('Listening on port' + port);

module.exports = app;
