var mongoose    = require('mongoose');	

exports.DBConnect = function(database){
	mongoose.connect(database);
}