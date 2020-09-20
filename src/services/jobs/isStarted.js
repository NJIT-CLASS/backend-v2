class Manager {
async isStarted(assignmentInstance, callback) {
    WorkflowInstance.count({
        where: {
            AssignmentInstanceID: assignmentInstance.AssignmentInstanceID
        }
    }).then(function(count) {
        callback(count > 0 ? true : false);
    });
}
}

var CronJob = require('cron').CronJob;
var job = new CronJob('* 2 * * * *', isStarted(assignmentInstance, callback) {
  console.log('Status Checked');
}, null, true, null);
job.start();