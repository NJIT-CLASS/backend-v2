async class Manager {
checkAssignments() {
    var x = this;
    AssignmentInstance.findAll({
        where: {
            EndDate: null
        }
    }).then(function(AIs) {
        return await Promise.mapSeries(AIs, function(assignmentInstance) {
            //console.log('checkAssginments: AssignmentInstanceID', assignmentInstance.AssignmentInstanceID);
            return await x.checkAssignment(assignmentInstance);
        });
    });
    }
}

var CronJob = require('cron').CronJob;
var job = new CronJob('* 2 * * * *', checkAssignments() {
  console.log('Assignments Checked');
}, null, true, null);
job.start();