import Logger from '../../loaders/logger';
import models from '../../models';
import emailService from '../../services/_helper/email/email.service';
import allocatorService from './reallocator.service';
var { TaskInstance, sequelize } = models;

module.exports = {
    reallocate_instructor,
    reallocate_tasks,
    reallocate_user_to_task,
};

//TODO  Possible removal as: NOT USED IN WORKFLOW CANCELLATION, TASK REALOCATION, or USER REALOCATION
async function reallocate_user_to_task(ti, new_u_id, is_extra_credit = true) {
    //reallocate ti with new_u_id

    var task_id = ti.TaskInstanceID;
    var ti_u_hist = JSON.parse(ti.UserHistory) || [];
    var extraCredit = is_extra_credit ? 1 : 0;

    ti_u_hist.push({
        time: new Date(),
        user_id: new_u_id,
        is_extra_credit: is_extra_credit,
    });

    if (is_extra_credit == null) {
        is_extra_credit = true;
    }

    if (JSON.parse(ti.Status)[0] === 'complete') {
        return {
            Error: true,
            Message: 'Task already completed',
        };
    }

    logger.log('info', 'update a task instance with a new user and user history', {
        task_instance: ti.toJSON(),
        new_user_id: new_u_id,
        user_history: ti_u_hist,
    });

    try {
        var ti = TaskInstance.update(
            {
                UserID: new_u_id,
                UserHistory: ti_u_hist,
                ExtraCredit: extraCredit,
            },
            {
                where: {
                    TaskInstanceID: task_id,
                },
            }
        );

        return {
            Error: false,
            Message: null,
        };
    } catch (e) {
        Logger.error('Failed reallocate user to another task. TaskID:' + task_id);
        Logger.debug(e);
        return {
            Error: true,
            Message: 'Failed reallocate user to another task',
        };
    }
}

//TODO  Possible removal as: NOT USED IN WORKFLOW CANCELLATION, TASK REALOCATION, or USER REALOCATION
async function reallocate_instructor(tis, instructor) {
    let x = this;
    await Promise.mapSeries(tis, async (ti_id) => {
        let ti = await TaskInstance.find({
            where: {
                TaskInstanceID: ti_id,
            },
        });

        let response = await x.reallocate_user_to_task(ti, instructor, false);

        if (response.Error) {
            return {
                Error: true,
                Message: 'Failed reallocate instructor to task',
            };
        } else {
            return response;
        }
    });
}

//TODO  Possible removal as: NOT USED IN WORKFLOW CANCELLATION, TASK REALOCATION, or USER REALOCATION
async function reallocate_tasks(tis, new_users, section_id, ai_id, option, is_extra_credit) {
    let users = new_users;
    let response = null;

    if (option === 'volunteers') {
        users = await allocatorService.get_volunteers(section_id, ai_id);
        if (users.length === 0) {
            return {
                Error: true,
                Message: 'No Volunteers Found!',
            };
        }
    } else if (option === 'students') {
        users = await allocatorService.get_section_users(section_id, option);
        if (users.length === 0) {
            return {
                Error: true,
                Message: 'No Students Found!',
            };
        }
    } else if (option === 'instructor') {
        users = await allocatorService.get_section_users(section_id, option);
        if (users.length === 0) {
            return {
                Error: true,
                Message: 'No Instructor Found!',
            };
        } else {
            return await allocatorService.reallocate_instructor(tis, users[0]);
        }
    } else {
        return {
            Error: true,
            Message: 'invalid option',
        };
    }

    // let maps = x.check(tis, users);
    // let keys = Object.keys(maps);

    // await Promise.mapSeries(keys, async(ti_id, index) => {
    //     let ti = await TaskInstance.find({
    //         where: {
    //             TaskInstanceID: ti_id
    //         }
    //     });

    //     return await x.reallocate_user_to_task(ti, maps[keys[index]], is_extra_credit);
    // });

    // return {
    //     Error: false,
    //     Message: null
    // };
}
