var connection = require('./dbcon');
var config      = require('./config');
var PaxInfoReceived = require('./models/paxinforeceived');

connection.DBConnect(config.database);

//======SAVE Api Posted Data in MongoDB=====
exports.ApiReceivedData = function(job){

  var apiInfo = new PaxInfoReceived({ 
    bookingreloc: job.data.bookingreloc, 
    paxemail: job.data.paxemail, 
    paxfirstname: job.data.paxfirstname,
    paxlastname: job.data.paxlastname,
    paxfromsector: job.data.paxfromsector,
    paxtosector: job.data.paxtosector,
    paxtravelinsurance: job.data.paxtravelinsurance,
    created_at: new Date()
  });

  apiInfo.save(function(err) {
    if (err) throw err;
  });
}