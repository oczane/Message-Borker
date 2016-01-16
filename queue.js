var kue     = require('kue');
var queue   = kue.createQueue();
var config  = require('./config');
var service = require('./dal');

//=====QUEUE AND PROCESS QUEUE
exports.WriteInQueue = function(request){
  var job = queue.create(config.postBookqueue,
                    { bookingreloc: request.headers.bookingreloc, 
                        paxemail: request.headers.paxemail, 
                        paxfirstname: request.headers.paxfirstname,
                        paxlastname: request.headers.paxlastname,
                        paxfromsector: request.headers.paxfromsector,
                        paxtosector: request.headers.paxtosector,
                        paxtravelinsurance: request.headers.paxtravelinsurance 
                    }).attempts(5);

  job.on('complete', function (){
      console.log('Job', job.id, 'with name', job.data.bookingreloc, 'is done');

      kue.Job.get(job.id, function(err, job) {
        console.log("Job " + job.id + " has been removed");
        job.remove();
      });
    }).on('failed', function (){
      console.log('Job', job.id, 'with name', job.data.bookingreloc, 'has failed');
       });
  
  job.save();
}

queue.process(config.postBookqueue, function (job, done){
	service.ApiReceivedData(job);
 	console.log('Job', job.id, 'is done. Job data is ' + job.data.bookingreloc);
 	done && done();
});


//==========================================================================================================================================
