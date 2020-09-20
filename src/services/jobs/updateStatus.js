class Manager {
async updateStatus(task, status) {
    task.Status = JSON.stringify(status);
    await task.save();
}
}

var CronJob = require('cron').CronJob;
var job = new CronJob('* 2 * * * *', updateStatus(task, status) {
  console.log('Status Updated');
}, null, true, null);
job.start();