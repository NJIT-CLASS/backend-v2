import * as _ from 'underscore';
import Logger from '../../loaders/logger';
import models from '../../models';
import emailService from '../../services/_helper/email/email.service';
var { User, TaskInstance, VolunteerPool, SectionUser, WorkflowInstance, sequelize } = models;

module.exports = {
    check,
    get_new_user,
    get_workflow_tis,
    get_volunteers,
    get_workflow_users,
    get_section_users,
};

//TODO  Possible removal as: NOT USED IN WORKFLOW CANCELLATION, TASK REALOCATION, or USER REALOCATION
//checks if the users are valid for reallocation
async function check(tis, users) {
    let x = this;
    let maps = {};
    await Promise.mapSeries(tis, async (ti_id) => {
        let ti = await TaskInstance.find({
            where: {
                TaskInstanceID: ti_id,
            },
        });

        let workflow_tis = await x.get_workflow_tis(ti);
        let ignore_users = await x.get_workflow_users(ti.WorkflowInstanceID);
        let new_user = await x.get_new_user(users, ignore_users);

        if (new_user === undefined) {
            return {
                Error: true,
                Message: 'There is an error with reallocation. Please check your list of students.',
            };
        }

        await Promise.mapSeries(workflow_tis, (w_ti_id) => {
            if (!maps.hasOwnProperty(JSON.stringify(w_ti_id))) {
                maps[w_ti_id] = new_user;
            }
        });
    });

    return maps;
}

//TODO  Possible removal as: NOT USED IN WORKFLOW CANCELLATION, TASK REALOCATION, or USER REALOCATION
async function get_workflow_tis(ti) {
    let return_list = [];
    return_list.push(ti.TaskInstanceID);

    let tasks = await TaskInstance.findAll({
        where: {
            WorkflowInstanceID: ti.WorkflowInstanceID,
        },
        attributes: ['TaskInstanceID', 'UserID'],
    });

    await Promise.mapSeries(tasks, async (task) => {
        if (task.UserID === ti.UserID) {
            return_list.push(task.TaskInstanceID);
        }
    });
}

//TODO  Possible removal as: NOT USED IN WORKFLOW CANCELLATION, TASK REALOCATION, or USER REALOCATION
async function get_new_user(users, ignore_users) {
    let new_user;
    let filter_users = _.difference(users, ignore_users);

    if (filter_users.length === 0) {
        return new_user;
    }

    new_user = users.shift();
    users.unshift(new_user);

    return new_user;
}

//TODO  Possible removal as: NOT USED IN WORKFLOW CANCELLATION, TASK REALOCATION, or USER REALOCATION
async function get_volunteers(section_id, ai_id) {
    let volunteers;
    if (ai_id !== null && ai_id !== undefined) {
        volunteers = await VolunteerPool.findAll({
            where: {
                SectionID: section_id,
                AssignmentInstanceID: ai_id,
            },
            attributes: ['UserID'],
        });
    } else {
        volunteers = await VolunteerPool.findAll({
            where: {
                SectionID: section_id,
            },
            attributes: ['UserID'],
        });
    }
    return volunteers;
}

//TODO  Possible removal as: NOT USED IN WORKFLOW CANCELLATION, TASK REALOCATION, or USER REALOCATION
async function get_section_users(section_id, option) {
    let users;
    if (option === 'students') {
        users = await SectionUser.findAll({
            where: {
                SectionID: section_id,
                Role: 'Student',
                Active: 1,
            },
            attributes: ['UserID'],
        });
    } else if (option === 'instructor') {
        users = await SectionUser.findAll({
            where: {
                SectionID: section_id,
                Role: 'Instructor',
                Active: 1,
            },
            attributes: ['UserID'],
        });
    }
    return users;
}

//TODO  Possible removal as: NOT USED IN WORKFLOW CANCELLATION, TASK REALOCATION, or USER REALOCATION
async function get_workflow_users(wi_id) {
    let users = await WorkflowInstance.findAll({
        where: {
            WorkflowInstanceID: wi_id,
        },
        attributes: ['UserID'],
    });
    return users;
}
