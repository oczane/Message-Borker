
//=====Get required npms and file references
var express     = require('express');
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var cluster     = require('cluster');
var app         = express();
var queue       = require('./queue');
//==========================================================================================================================================

if(app.get('env') == "production")
  console.log("Production");
else
  console.log('Development');

// configuration =========
var port = process.env.PORT || 8080; // used to create, sign, and verify tokens
// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));


// start the server using cluster======
if(cluster.isMaster) {
    var numWorkers = require('os').cpus().length;

    console.log('Master cluster setting up ' + numWorkers + ' workers...');

    for(var i = 0; i < numWorkers; i++) {
        cluster.fork();
    }

    cluster.on('online', function(worker) {
        console.log('Worker ' + worker.process.pid + ' is online');
    });

    cluster.on('exit', function(worker, code, signal) {
        console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
        console.log('Starting a new worker');
        cluster.fork();
    });
} else {
    app.post('/', function(req, res) {
      queue.WriteInQueue(req);
      res.send('Processed...');
    });

    var server = app.listen(port, function() {
        console.log('Process ' + process.pid + ' is listening to all incoming requests');
    });
}