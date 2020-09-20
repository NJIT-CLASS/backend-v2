class Manager {
async checkTask(task, users) {
    //only check for started
    var x = this;
    var date = await task.timeOutTime();
    var now = new Date();
    if (date < now) {
        await x.timeOut(task, users);
    }
}
}

var CronJob = require('cron').CronJob;
var job = new CronJob('* 2 * * * *', checkTask(task, users) {
  console.log('Task Checked');
}, null, true, null);
job.start();