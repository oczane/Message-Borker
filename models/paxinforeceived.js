// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('PaxInfoReceived', new Schema({ 
    bookingreloc: String, 
    paxemail: String, 
    paxfirstname: String,
    paxlastname: String,
    paxfromsector: String,
    paxtosector: String,
    paxtravelinsurance: Boolean,
    created_at: Date
}));