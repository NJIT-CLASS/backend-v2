class Manager {
async checkLate() {
    var x = this;
    TaskInstance.findAll({
        where: {
            Status: '%"late"%'
        }
    }).then(function(taskInstances) {
        taskInstances.forEach(function(task) {
            email.send(task.UserID, "late", { ti_id: task.TaskInstanceID });
        });
    });
    }
}

var CronJob = require('cron').CronJob;
var job = new CronJob('* 2 * * * *', checkLate() {
  console.log('Checked If Late');
}, null, true, null);
job.start();