class Manager {
async check() {
    var x = this;

    logger.log("info", "/Workflow/Manager/check(): initiating...");
    var lst = await TaskInstance.findAll({
        where: {
            $or: [
                {
                    Status: {
                        $like: '%"started"%'
                    }
                },
                {
                    Status: {
                        $like: '%"late_reallocated"%'
                    }
                }
            ],
            $and: {
                Status: {
                    $notLike: '%"late"%'
                }
            }
        },
        include: [
            {
                model: AssignmentInstance,
                attributes: [
                    "AssignmentInstanceID",
                    "AssignmentID",
                    "WorkflowTiming"
                ],
                include: [
                    {
                        model: Section,
                        attributes: ["SectionID"]
                    }
                ]
            },
            {
                model: TaskActivity,
                attributes: [
                    "Type",
                    "WhatIfLate",
                    "AtDurationEnd",
                    "DueType"
                ]
            }
        ]
    });

var CronJob = require('cron').CronJob;
var job = new CronJob('* /2 * * * *', check() {
  console.log('Checked');
});