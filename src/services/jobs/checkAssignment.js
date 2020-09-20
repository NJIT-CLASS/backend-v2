class Manager {
async checkAssignment(assignmentInstance) {
    var x = this;
    var startDate = assignmentInstance.StartDate;

    var now = new Date().getTime();

    if (startDate < now) {
        // console.log(
        //     "checkAssginment: Start Date has past ",
        //     assignmentInstance.AssignmentInstanceID
        // );
        return await x.isStarted(assignmentInstance, function(result) {
            // console.log(
            //     "checkAssignment: ",
            //     assignmentInstance.AssignmentInstanceID,
            //     result
            // );
            if (!result)
                //return taskFactory.createInstances(assignmentInstance.SectionID, assignmentInstance.AssignmentInstanceID);
                return await make.allocateUsers(
                    assignmentInstance.SectionID,
                    assignmentInstance.AssignmentInstanceID
                );
        });
    }
}
}

var CronJob = require('cron').CronJob;
var job = new CronJob('* 2 * * * *', checkAssignment(assignmentInstance) {
  console.log('Checked Assignment');
}, null, true, null);
job.start();