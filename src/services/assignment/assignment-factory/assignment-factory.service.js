import { Promise } from 'bluebird';
import config from '../../../config';
import Logger from '../../../loaders/logger';
import models from '../../../models';
import partialAssignmentService from '../partial-assignment/partial-assignment.service';
import assignmentActivityService from '../assignment/assignment-activity.service';
import workflowActivityService from '../workflow/workflow-activity.service';
import taskActivityService from '../task/task-activity.service';

var { sequelize } = models;

module.exports = {
    createAssignmentSkeleton,
};

async function createAssignmentSkeleton(assignmentObject, t) {
    var WA_array = [];

    const assignmentActivity = await assignmentActivityService.createAssignmentActivity(
        {
            OwnerID: assignmentObject.AA_userID,
            Name: assignmentObject.AA_name,
            CourseID: assignmentObject.AA_course,
            Instructions: assignmentObject.AA_instructions,
            Type: assignmentObject.AA_type,
            DisplayName: assignmentObject.AA_display_name,
            SectionID: assignmentObject.AA_section,
            SemesterID: assignmentObject.AA_semester,
            GradeDistribution: assignmentObject.AA_grade_distribution,
            Documentation: assignmentObject.AA_documentation,
        },
        t
    );

    await Promise.mapSeries(assignmentObject.WorkflowActivity, async function (workflow, index) {
        const workflowActivity = await workflowActivityService.createWorkflowActivity(
            {
                AssignmentID: assignmentActivity.AssignmentID,
                Type: workflow.WA_type,
                Name: workflow.WA_name,
                GradeDistribution: workflow.WA_grade_distribution,
                NumberOfSets: workflow.WA_number_of_sets,
                Documentation: workflow.WA_documentation,
                GroupSize: workflow.WA_default_group_size,
                WorkflowStructure: workflow.WorkflowStructure,
            },
            t
        );

        WA_array.push(workflowActivity.WorkflowActivityID);
        var TA_array = [];

        await Promise.mapSeries(assignmentObject.WorkflowActivity[index].Workflow, async function (task) {
            const taskActivity = await taskActivityService.createTaskActivity(
                {
                    WorkflowActivityID: workflowActivity.WorkflowActivityID,
                    AssignmentID: workflowActivity.AssignmentID,
                    Type: task.TA_type,
                    Name: task.TA_name,
                    FileUpload: task.TA_file_upload,
                    DueType: task.TA_due_type,
                    StartDelay: task.TA_start_delay,
                    AtDurationEnd: task.TA_at_duration_end,
                    WhatIfLate: task.TA_what_if_late,
                    DisplayName: task.TA_display_name,
                    Documentation: task.TA_documentation,
                    OneOrSeparate: task.TA_one_or_separate,
                    AssigneeConstraints: task.TA_assignee_constraints,
                    SimpleGrade: task.TA_simple_grade,
                    IsFinalGradingTask: task.TA_is_final_grade,
                    Instructions: task.TA_overall_instructions,
                    Rubric: task.TA_overall_rubric,
                    Fields: task.TA_fields,
                    AllowReflection: task.TA_allow_reflection,
                    AllowRevision: task.TA_allow_revisions,
                    AllowAssessment: task.TA_allow_assessment,
                    NumberParticipants: task.TA_number_participant,
                    TriggerConsolidationThreshold: task.TA_trigger_consolidation_threshold,
                    FunctionType: task.TA_function_type,
                    AllowDispute: task.TA_allow_dispute,
                    LeadsToNewProblem: task.TA_leads_to_new_problem,
                    LeadsToNewSolution: task.TA_leads_to_new_solution,
                    VisualID: task.TA_visual_id,
                    MinimumDuration: task.TA_minimum_duration,
                    VersionEvaluation: task.VersionEvaluation,
                    SeeSibblings: task.SeeSibblings,
                    SeeSameActivity: task.SeeSameActivity,
                    AssessmentTask: task.TA_AssessmentTask,
                    RefersToWhichTask: task.RefersToWhichTask,
                    MustCompleteThisFirst: task.TA_MustCompleteThisFirst,
                },
                t
            );

            TA_array.push(taskActivity.TaskActivityID);
        });
        console.log(workflowActivity);
        await updateWorkflowGradeDistribution(assignmentObject, TA_array, workflowActivity, index, t);
        console.log('here3');
        await updateIDs(TA_array, t);
        console.log('here4');
        await replaceTreeID(workflowActivity.WorkflowActivityID, TA_array, workflowActivity.WorkflowStructure, t);
        console.log('here5');
    });
    console.log('here');
    await updateAssignmentGradeDistribution(assignmentObject, WA_array, assignmentActivity, index, t);
    await t.commit();
}

async function updateWorkflowGradeDistribution(assignment, TA_array, workflowActivity, index, t) {
    Logger.info('AssignmentFactory::updateWorkflowGradeDistribution::Updating workflow grade distribution');
    var WA_gradeDistribution = {};
    for (var item in assignment.WorkflowActivity[index].WA_grade_distribution) {
        if (item == 'simple') {
            WA_gradeDistribution[item] = assignment.WorkflowActivity[index].WA_grade_distribution[item];
        } else {
            WA_gradeDistribution[TA_array[parseInt(item)]] = assignment.WorkflowActivity[index].WA_grade_distribution[item];
        }
    }
    const updatedWorkflowActivity = await workflowActivityService.updateWorkflowActivity(
        {
            TaskActivityCollection: TA_array,
            GradeDistribution: WA_gradeDistribution,
            WorkflowActivityID: workflowActivity.WorkflowActivityID,
        },
        t
    );
}

async function replaceTreeID(wa_id, ta_array, tree, t) {
    var replacedTree = tree;
    var count = 0;

    await Promise.map(replacedTree, function (node, index) {
        if (node.id != -1 && node.hasOwnProperty('parent')) {
            replacedTree[index]['id'] = ta_array[count];
            replacedTree[index]['parent'] = ta_array[replacedTree[index].parent];
            count++;
        } else if (node.id != -1) {
            replacedTree[index]['id'] = ta_array[count];
            count++;
        }
    });

    const workflowActivity = await workflowActivityService.updateWorkflowActivity({
        WorkflowStructure: replacedTree,
        WorkflowActivityID: wa_id,
    });
}

async function updateIDs(ta_array, t) {
    if (typeof ta_array === undefined) {
        Logger.info('AssignmentFactory::updateIDs::Task array is empty');
    }
    //Iterate through ta_array
    await Promise.mapSeries(ta_array, async function (task) {
        const taskActivity = await taskActivityService.findOneTaskActivity({
            TaskActivityID: task,
        });

        var assigneeConstraints = JSON.parse(taskActivity.AssigneeConstraints);
        var refersToWhichTask = JSON.parse(taskActivity.RefersToWhichTask);

        //Loop through Assignee Constraints
        for (var item in assigneeConstraints[2]) {
            var temp = [];
            assigneeConstraints[2][item].forEach(function (index) {
                temp.push(ta_array[index]);
            });
            assigneeConstraints[2][item] = temp;
        }

        //Clean task field default_refers_to here to minimize DB calls
        var fields = JSON.parse(taskActivity.Fields);
        if (fields !== null) {
            for (var fieldIndex = 0; fieldIndex < fields.number_of_fields; fieldIndex++) {
                if (fields[fieldIndex].default_refers_to !== null && fields[fieldIndex].default_refers_to[0] !== null) {
                    fields[fieldIndex].default_refers_to[0] = ta_array[fields[fieldIndex].default_refers_to[0]];
                }
            }
        }

        var taskActivityData = {};
        if (refersToWhichTask != null) {
            taskActivityData = {
                AssigneeConstraints: assigneeConstraints,
                RefersToWhichTask: ta_array[refersToWhichTask],
                Fields: fields,
                TaskActivityID: taskActivity.TaskActivityID,
            };
        } else {
            taskActivityData = {
                AssigneeConstraints: assigneeConstraints,
                Fields: fields,
                TaskActivityID: taskActivity.TaskActivityID,
            };
        }

        await taskActivityService.updateTaskActivity(taskActivityData, t);
    });
}

async function updateAssignmentGradeDistribution(assignment, WA_array, assignmentActivity, t) {
    //After all WorkflowActivities are created update the list of WorkflowActivities in Assignment
    var AA_gradeDistribution = {};
    for (var item in assignment.AA_grade_distribution) {
        AA_gradeDistribution[WA_array[parseInt(item)]] = assignment.AA_grade_distribution[item];
    }

    const updatedAssignmentActivity = await assignmentActivityService.updateAssignmentActivity({
        WorkflowActivityIDs: WA_array,
        GradeDistribution: AA_gradeDistribution,
        AssignmentID: assignmentActivity.AssignmentID,
    });
}
