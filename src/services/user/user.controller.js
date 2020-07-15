import { response } from 'express';
import faker from 'faker';
import bcrypt from 'bcrypt';

import Logger from '../../loaders/logger';
import models from '../../models';
var { User, UserLogin, UserContact, sequelize, Organization } = models;
import { ROLES } from '../../constants/constants';

import authService from '../auth/auth.service';
import userService from './user.service';
import responseService from '../_helper/response.service';
import emailService from '../_helper/email/email.service';

module.exports = {
    addInitialUser,
    checkInitialUser,
    checkPendingStatus,
    createFakeUser,
    createUser,
    createUser2,
    findAll,
    getUserByUserID,
    updateEmail,
    updateName,
    updatePassword,
    updateContact,
};

async function createUser2(req, res, next) {
    try {
        const data = req.body;
        if (req.body === null) {
            Logger.error('UserController::createUser2::Body is empty');
            return res.status(400).send(await responseService.errorMessage('UserController::createUser2::Body is empty'));
        }

        const isTestUSer = 'test' in req.body ? req.body.test : false;
        const organization = 'organization' in req.body ? req.body.organization : null;

        const userData = {
            FirstName: req.body.firstname,
            LastName: req.body.lastname,
            Role: req.body.role,
            Test: isTestUSer,
            OrganizationGroup: organization,
        };

        const userContactData = {
            FirstName: req.body.firstname,
            LastName: req.body.lastname,
            Email: req.body.email,
            Phone: '(XXX) XXX-XXXX',
        };

        const userLoginData = {
            Email: req.body.email,
            Password: req.body.password,
            Pending: req.body.trustpassword ? false : true,
        };

        const t = await sequelize.transaction();
        const user = await userService.createUser(userData, t);
        userContactData.UserID = user.UserID;
        userLoginData.UserID = user.UserID;
        const login = await userService.createLogin(userLoginData, t);
        const contact = await userService.createContact(userContactData, t);

        if (user != null && (login != null) & (contact != null)) {
            await t.commit();
            Logger.info('UserController::createUser2::New user created. UserId: ' + user.UserID);
            return res.status(201).send(user);
        } else {
            Logger.error('UserController::createUser2::Cannot create user.');
            return res.status(400).send(await responseService.errorMessage('UserController::createUser2::Cannot create user.'));
        }
    } catch (e) {
        Logger.error('UserController::createUser2::' + e);
        return res.status(500).send(await responseService.errorMessage('UserController::createUser2::' + e));
    }
}

async function createUser(req, res, next) {
    try {
        const data = req.body;
        if (req.body === null) {
            Logger.error('UserController::createUser::Body is empty');
            return res.status(400).send(await responseService.errorMessage('UserController::createUser::Body is empty'));
        }
        const t = await sequelize.transaction();
        const user = await userService.createUser(data, t);
        data.UserID = user.UserID;
        const login = await userService.createLogin(data, t);
        const contact = await userService.createContact(data, t);
        if (user != null && (login != null) & (contact != null)) {
            await t.commit();
            Logger.info('UserController::createUser::New user created. UserId: ' + user.UserID);
            return res.status(201).send(user);
        } else {
            Logger.error('UserController::createUser::Cannot create user.');
            return res.status(400).send(await responseService.errorMessage('UserController::createUser::Cannot create user.'));
        }
    } catch (e) {
        Logger.error('UserController::createUser::' + e);
        return res.status(500).send(await responseService.errorMessage('UserController::createUser::' + e));
    }
}

async function createFakeUser(req, res, next) {
    try {
        const data = {
            FirstName: faker.name.firstName(),
            LastName: faker.name.lastName(),
            Email: faker.internet.email(),
            Phone: faker.phone.phoneNumber(),
            Role: req.body.role,
            Admin: req.body.admin,
            Instructor: req.body.instructor,
            Organization: 'NJIT',
            Password: 'testuserpl',
        };
        const t = await sequelize.transaction();
        const user = await userService.createUser(data, t);
        data.UserID = user.UserID;
        const login = await userService.createLogin(data, t);
        const contact = await userService.createContact(data, t);
        if (user != null && (login != null) & (contact != null)) {
            await t.commit();
            Logger.info('UserController::createFakeUser::New user created. UserId: ' + user.UserID);
            return res.status(201).send(user);
        } else {
            Logger.error('UserController::createFakeUser::Cannot create user.');
            return res.status(400).send(await responseService.errorMessage('UserController::createUser::Cannot create user.'));
        }
    } catch (e) {
        Logger.error('UserController::createFakeUser::' + e);
        return res.status(500).send(await responseService.errorMessage('UserController::createFakeUser::' + e));
    }
}

async function getUserByUserID(req, res, next) {
    try {
        const user = await User.findOne({
            where: {
                UserID: req.params.userid,
            },
            include: [
                {
                    model: UserLogin,
                },
                {
                    model: UserContact,
                },
            ],
        });

        if (user == null) {
            Logger.info('UserController::getUserByUserID::User not found');
            return res.status(400).send(await responseService.errorMessage('UserController::getUserByUserID::User not found'));
        }
        if (user.UserContact.AdministrativeSupport == null) {
            // substitute null for old database fields TODO: remove in the future
            user.UserContact.AdministrativeSupport = [0, []];
        }
        if (user.UserContact.TechnicalSupport == null) {
            // substitute null for old database fields TODO: remove in the future
            user.UserContact.TechnicalSupport = [0, []];
        }
        var org_group = typeof user.OrganizationGroup == 'string' ? JSON.parse(user.OrganizationGroup) : user.OrganizationGroup;
        if (org_group != null) {
            var org_ids = org_group.OrganizationID; // array of organization IDS user is part of
        } else {
            var org_ids = []; // if field is null
        }

        const orgs = await Organization.findAll({
            where: {
                OrganizationID: {
                    $in: org_ids,
                },
            },
            attributes: ['OrganizationID', 'Name'],
        });
        Logger.info('UserController::getUserByUserID::User found. UserID:' + user.UserID);
        return res.status(200).json(
            await responseService.successMessage({
                Error: false,
                Message: 'Success',
                User: user,
                OrganizationIDs: orgs,
            })
        );
    } catch (e) {
        Logger.error('UserController::getUserByUserID::' + e);
        return res.status(500).send(await responseService.errorMessage('UserController::getUserByUserID::' + e));
    }
}

async function findAll(req, res, next) {
    try {
        const users = await userService.findAll();
        return res.status(200).send(await responseService.successMessage(users));
    } catch (e) {
        Logger.error('UserController::findAll::' + e);
        return res.status(500).send(await responseService.errorMessage('UserController::findAll::' + e));
    }
}

async function checkInitialUser(req, res, next) {
    try {
        const user = await User.findOne();

        if (user === null) {
            return res.status(400).send(await responseService.errorMessage('UserController::checkInitialUser::No user found'));
        } else {
            return res.status(200).send(await responseService.successMessage('UserController::checkInitialUser::User Found'));
        }
    } catch (e) {
        Logger.error('UserController::checkInitialUser::' + e);
        res.status(500).send(await responseService.errorMessage('UserController::checkInitialUser::' + e));
    }
}

async function addInitialUser(req, res, next) {
    try {
        const userExist = await User.findOne();
        if (userExist !== null) {
            Logger.error('UserController::addInitialUser::User found');
            return res.status(400).send(await responseService.errorMessage('UserController::addInitialUser::User found'));
        }

        if (req.body.email === null) {
            Logger.error('UserController::addInitialUser::Email empty');
            return res.status(400).send(await responseService.errorMessage('UserController::addInitialUser::Email empty'));
        }

        const temp_pass = await authService.generatePassword();
        const data = {
            FirstName: req.body.firstname,
            LastName: req.body.lastname,
            Email: req.body.email,
            Instructor: 1,
            Admin: 1,
            Role: ROLES.ADMIN,
            Password: temp_pass,
            Pending: 0,
        };
        const t = await sequelize.transaction();
        const user = await userService.createUser(data, t);
        data.UserID = user.UserID;
        await userService.createLogin(data, t);
        await userService.createContact(data, t);
        await t.commit();

        emailService.send('onboarding', { email: req.body.email });

        return res.status(201).send(user);
    } catch (e) {
        Logger.error('UserController::addInitialUser::' + e);
        return res.status(500).send(await responseService.errorMessage('UserController::addInitialUser::' + e));
    }
}

async function checkPendingStatus(req, res, next) {
    try {
        var user = await userService.findOneUserLogin({ UserID: req.params.userId });
        Logger.error('UserController::checkPendingStatus::Check user pending status. UserID:' + req.params.userId);

        if (user.Pending == 1) {
            return res.status(200).send(await responseService.successMessage(user.Pending));
        } else {
            return res.status(403).send(await responseService.errorMessage('UserController::checkPendingStatus::Pending is 0'));
        }
    } catch (e) {
        Logger.error('UserController::checkPendingStatus::' + e);
        return res.status(500).send(await responseService.errorMessage('UserController::checkPendingStatus::' + e));
    }
}

//TODO: check if this call is in use
async function updateEmail(req, res, next) {
    try {
        if (req.body.password == null || req.body.email == null || req.body.UserID == null) {
            Logger.error('UserController::updateEmail::Missing data in body');
            return res.status(400).send(await responseService.errorMessage('UserController::updateEmail::Missing data in body'));
        }

        const userLogin = await UserLogin.findOne({
            where: {
                UserID: req.body.UserID,
            },
        });
        if (userLogin != null && (await bcrypt.compare(req.body.password, userLogin.Password))) {
            const updatedUserLogin = await userService.updateLogin({
                UserID: req.body.UserID,
                Email: req.body.email,
            });

            const updatedUserContact = await userService.updateContact({
                UserID: req.body.UserID,
                Email: req.body.email,
            });

            if (updatedUserLogin != null && updatedUserContact != null) {
                Logger.info('UserController::updateEmail::Email Updated. UserID: ' + req.body.UserID);
                return res.status(200).send(await responseService.successMessage('UserController::updateEmail::Email Updated. UserID: ' + req.body.UserID));
            } else {
                Logger.error('UserController::updateEmail::User is null!');
                return res.status(400).send(await responseService.errorMessage('UserController::updateEmail::User is null!'));
            }
        } else {
            Logger.error('UserController::updateEmail::Cannot find UserID: ' + req.body.UserID);
            return res.status(400).send(await responseService.errorMessage('UserController::updateEmail::Cannot find UserID: ' + req.body.UserID));
        }
    } catch (e) {
        Logger.error('UserController::updateEmail::' + e);
        return res.status(500).send(await responseService.errorMessage('UserController::updateEmail::' + e));
    }
}
//TODO: check if this call is in use
async function updateName(req, res, next) {
    try {
        if (req.body.firstname == null || req.body.lastname == null || req.body.UserID == null) {
            Logger.error('UserController::updateName::Missing data in body');
            return res.status(400).send(await responseService.errorMessage('UserController::updateName::Missing data in body'));
        }

        const user = await User.findOne({
            where: {
                UserID: req.body.UserID,
            },
        });
        if (user != null) {
            const updatedUser = await userService.updateUser({
                UserID: req.body.UserID,
                FirstName: req.body.firstname,
                LastName: req.body.lastname,
            });

            if (updatedUser != null) {
                Logger.info('UserController::updateName::Name updated. UserID: ' + req.body.UserID);
                return res.status(200).send(await responseService.successMessage('UserController::updateName::Name updated. UserID: ' + req.body.UserID));
            } else {
                Logger.error('UserController::updateName::User Login Object is null!');
                return res.status(400).send(await responseService.errorMessage('UserController::updateName::User Object is null!'));
            }
        } else {
            Logger.error('UserController::updateName::Cannot find UserID: ' + req.body.UserID);
            return res.status(400).send(await responseService.errorMessage('UserController::updateName::Cannot find UserID: ' + req.body.UserID));
        }
    } catch (e) {
        Logger.error('UserController::updateName::' + e);
        return res.status(500).send(await responseService.errorMessage('UserController::updateName::' + e));
    }
}

async function updatePassword(req, res, next) {
    try {
        if (req.body.UserID === null || req.body.oldPasswd === null || req.body.newPasswd === null) {
            Logger.error('UserController::updatePassword::Missing data in body');
            return res.status(400).send(await responseService.errorMessage('UserController::updatePassword::Missing data in body'));
        }

        if (req.body.oldPasswd == req.body.newPasswd) {
            Logger.error('UserController::updatePassword::New password cannot match old password');
            return res.status(400).send(await responseService.errorMessage('UserController::updatePassword::New password cannot match old password'));
        }

        const userLogin = await UserLogin.findOne({
            where: {
                UserID: req.body.UserID,
            },
        });

        if (userLogin != null && (await bcrypt.compare(req.body.oldPasswd, userLogin.Password))) {
            const updatedUser = await userService.updatePassword({
                UserID: req.body.UserID,
                Password: req.body.newPasswd,
            });

            if (updatedUser != null) {
                Logger.info('UserController::updatePassword::Password updated. UserID: ' + req.body.UserID);
                emailService.send('update_password', { email: req.body.email });
                return res
                    .status(200)
                    .send(await responseService.successMessage('UserController::updatePassword::Password updated. UserID: ' + req.body.UserID));
            } else {
                Logger.error('UserController::updatePassword::User Login Object is null!');
                return res.status(400).send(await responseService.errorMessage('UserController::updatePassword::User Object is null!'));
            }
        } else {
            Logger.error('UserController::updatePassword::Cannot find UserID: ' + req.body.UserID);
            return res.status(400).send(await responseService.errorMessage('UserController::updatePassword::Cannot find UserID: ' + req.body.UserID));
        }
    } catch (e) {
        Logger.error('UserController::updatePassword::' + e);
        return res.status(500).send(await responseService.errorMessage('UserController::updatePassword::' + e));
    }
}

async function updateContact(req, res, next) {
    try {
        const data = req.body;
        if (data.UserID == null) {
            Logger.error('UserController::updateContact::Missing data in body');
            return res.status(400).send(await responseService.errorMessage('UserController::updateContact::Missing data in body'));
        }
        const t = await sequelize.transaction();
        const userContact = await userService.updateContact(data, t);
        sequelize.options.omitNull = true;

        if (userContact == null) {
            Logger.error('UserController::updateContact::Cannot update user contact. UserID: ' + data.UserID);
            return res
                .status(400)
                .send(await responseService.errorMessage('UserController::updateContact::Cannot update user contact. UserID: ' + data.UserID));
        } else {
            await t.commit();
            Logger.info('UserController::updateContact::UserID: ' + data.UserID);
            return res.status(200).json(
                await responseService.successMessage({
                    success: true,
                })
            );
        }
    } catch (e) {
        Logger.error('UserController::updateContact::' + e);
        return res.status(500).send(await responseService.errorMessage('UserController::updateContact::' + e));
    }
}
