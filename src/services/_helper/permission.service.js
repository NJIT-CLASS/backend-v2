import { ROLES, canRoleAccess } from '../../constants/constants';

module.exports = {
    adminAuthentication,
    enhancedAuthentication,
    teacherAuthentication,
    participantAuthentication,
};

async function adminAuthentication(req, res, next) {
    // do any checks you want to in here

    // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
    // you can do this however you want with whatever variables you set up
    if (canRoleAccess(req.user.role, ROLES.ADMIN)) return next();

    // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
    res.send('No Access Permission');
}

async function enhancedAuthentication(req, res, next) {
    // do any checks you want to in here

    // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
    // you can do this however you want with whatever variables you set up
    if (canRoleAccess(req.user.role, ROLES.ENHANCED)) return next();

    // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
    res.send('No Access Permission');
}

async function teacherAuthentication(req, res, next) {
    // do any checks you want to in here

    // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
    // you can do this however you want with whatever variables you set up
    if (canRoleAccess(req.user.role, ROLES.TEACHER)) return next();

    // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
    res.send('No Access Permission');
}

async function participantAuthentication(req, res, next) {
    // do any checks you want to in here

    // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
    // you can do this however you want with whatever variables you set up
    if (canRoleAccess(req.user.role, ROLES.PARTICIPANT)) return next();

    // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
    res.send('No Access Permission');
}
