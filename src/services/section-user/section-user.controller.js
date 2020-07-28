import userService from '../user/user.service';
import authService from '../auth/auth.service';
import sectionUserService from './section-user.service';
import Logger from '../../loaders/logger';
import responseService from '../_helper/response.service';
import models from '../../models';
import section from '../../api-routes/routes/section';
import { ROLES } from '../../constants/constants';
import { Promise } from 'bluebird';
import e from 'express';
var { SectionUser, Section, Course, User, UserLogin, VolunteerPool, sequelize } = models;

module.exports = {
    createSectionUser,
    findSectionUserByIDAndRole,
    addManySectionUsers,
};

async function findSectionUserByIDAndRole(req, res, next) {
    try {
        if (req.params.sectionid == null || req.params.role == null) {
            Logger.error('SectionUserController::findSectionUserByIDAndRole::Missing data');
            return res.status(400).send(await responseService.errorMessage('SectionUserController::findSectionUserByIDAndRole::Missing data'));
        }

        const sectionUsers = await SectionUser.findAll({
            where: {
                SectionID: req.params.sectionid,
                Role: req.params.role,
            },
            include: [
                {
                    model: User,
                    attributes: ['FirstName', 'LastName'],
                    include: [
                        {
                            model: VolunteerPool,
                        },
                    ],
                },
                {
                    model: UserLogin,
                    attributes: ['Email'],
                },
            ],
            order: [
                [User, 'LastName'],
                [User, 'FirstName'],
                [UserLogin, 'Email'],
            ],
            attributes: ['SectionUserID', 'UserID', 'Active', 'Volunteer', 'Role'],
        });

        if (sectionUsers == null) {
            Logger.error('SectionUserController::findSectionUserByIDAndRole::Cannot find section users');
            return res.status(400).send(await responseService.errorMessage('SectionUserController::findSectionUserByIDAndRole::Cannot find section users'));
        }

        var newSectionUsers = await sectionUsers.map((user) => {
            let newUser = {
                UserID: user.UserID,
                SectionUserID: user.SectionUserID,
                Active: user.Active,
                Role: user.Role,
                User: user.User,
                UserLogin: user.UserLogin,
            };
            if (user.User.VolunteerPools.length != 0) {
                newUser.Volunteer = 'Some';
                //newUser.Status = user.User.VolunteerPools[0].status;
            } else if (user.Volunteer != 0 && user.Volunteer != 'Declined' && user.Volunteer != 'Removed') {
                newUser.Volunteer = 'All';
            } else {
                newUser.Volunteer = 'None';
                newUser.Status = 'Inactive';
            }
            return newUser;
        });

        return res.status(200).json(
            await responseService.successMessage({
                Error: false,
                SectionUsers: newSectionUsers,
            })
        );
    } catch (e) {
        Logger.error('SectionUserController::findSectionUserByIDAndRole::' + e);
        return res.status(500).send(await responseService.errorMessage('SectionUserController::findSectionUserByIDAndRole::' + e));
    }
}

//expects -email
//        -firstName
//        -lastName
//        -email
//        -sectionid
//        -active
//        -body
//        -role
async function createSectionUser(req, res, next) {
    try {
        if (req.body.email == null) {
            Logger.error('SectionUserController::createSectionUser::Missing email');
            return res.status(400).send(await responseService.errorMessage('SectionUserController::createSectionUser::Missing email'));
        }

        if (req.body.volunteer === null) {
            Logger.info('SectionUserController::createSectionUser::Volunteer null');
        } else {
            if (req.body.volunteer == 0) {
                Logger.info('SectionUserController::createSectionUser::Volunteer 0');
            } else {
                req.body.volunteer = 'Appointed';
            }
        }

        const userLogin = await userService.findOneUserLogin({
            Email: req.body.email,
        });

        //if user doesn't exist in the system yet, create new User, SectionUser, UserContact and UserLogin
        if (userLogin == null) {
            Logger.info('SectionUserController::createSectionUser::Cannot find user in the system, creating a new user...');

            const password = await authService.generatePassword();
            const data = {
                FirstName: req.body.firstName,
                LastName: req.body.lastName,
                Instructor: req.body.role === 'Instructor',
                Role: req.body.role,
                Email: req.body.email,
                Password: password,
                Active: req.body.active,
                Volunteer: req.body.volunteer,
                SectionID: req.params.sectionid,
            };

            const t = await sequelize.transaction();
            const user = await userService.createUser(data, t);
            data.UserID = user.UserID;
            const login = await userService.createLogin(data, t);
            const contact = await userService.createContact(data, t);

            if (user != null && (login != null) & (contact != null)) {
                const sectionUser = await sectionUserService.createSectionUser(data, t);

                if (sectionUser != null) {
                    await t.commit();
                    //TODO:Send email
                    Logger.info('SectionUserController::createSectionUser::New user created. UserID: ' + user.UserID);
                    return res.status(200).send(
                        await responseService.successMessage({
                            success: true,
                            message: 'invited new user to system',
                            SectionUser: sectionUser,
                            User: user,
                        })
                    );
                } else {
                    Logger.error('SectionUserController::createSectionUser::Cannot create section user. Email: ' + req.body.email);
                    return res
                        .status(400)
                        .send(
                            await responseService.errorMessage('SectionUserController::createSectionUser::Cannot create section user. Email: ' + req.body.email)
                        );
                }
            } else {
                Logger.error('SectionUserController::createSectionUser::Cannot create user. Email: ' + req.body.email);
                return res
                    .status(400)
                    .send(await responseService.errorMessage('SectionUserController::createSectionUser::Cannot create user. Email: ' + req.body.email));
            }
        } else {
            Logger.info('SectionUserController::createSectionUser::UserID: ' + userLogin.UserID);
            const sectionUser = await sectionUserService.findOneSectionUser({
                SectionID: req.params.sectionid,
                UserID: userLogin.UserID,
            });

            if (sectionUser != null) {
                Logger.info('SectionUserController::createSectionUser::Section user already exist. SectionUserID: ' + sectionUser.SectionUserID);
                return res.status(201).send(
                    await responseService.successMessage({
                        success: false,
                        error: 'already in section',
                    })
                );
            } else {
                const t = await sequelize.transaction();
                const newSectionUser = await sectionUserService.createSectionUser({
                    SectionID: req.params.sectionid,
                    UserID: userLogin.UserID,
                    Active: req.body.active,
                    Volunteer: req.body.volunteer,
                    Role: req.body.role,
                });

                if (newSectionUser != null) {
                    await t.commit();
                    //TODO:Send email
                    Logger.info('SectionUserController::createSectionUser::SectionUserID: ' + newSectionUser.SectionUserID);
                    return res.status(200).send(
                        await responseService.successMessage({
                            success: true,
                            message: 'existing user',
                            SectionUser: newSectionUser,
                        })
                    );
                } else {
                    Logger.error('SectionUserController::createSectionUser::Cannot create section user. Email: ' + req.body.email);
                    return res
                        .status(400)
                        .send(
                            await responseService.errorMessage('SectionUserController::createSectionUser::Cannot create section user. Email: ' + req.body.email)
                        );
                }
            }
        }
    } catch (e) {
        Logger.error('SectionUserController::createSectionUser::' + e);
        return res.status(500).send(await responseService.errorMessage('SectionUserController::createSectionUser::' + e));
    }
}

async function addManySectionUsers(req, res, next) {
    try {
        if (req.body.users == null || req.params.sectionid == null) {
            Logger.error('SectionUserController::addManySectionUsers::Missing data');
            return res.status(500).send(await responseService.errorMessage('SectionUserController::addManySectionUsers::Missing data'));
        }
        const users = req.body.users;
        const t = await sequelize.transaction();
        return Promise.mapSeries(req.body.users, async function (userObj) {
            console.log(userObj);
            console.log(userObj.firstName);
            const userLogin = await userService.findOneUserLogin({
                Email: userObj.email,
            });

            //if user doesn't exist in the system yet, create new User, SectionUser, UserContact and UserLogin
            if (userLogin == null) {
                Logger.info('SectionUserController::addManySectionUsers::Cannot find user in the system, creating a new user...');

                const password = await authService.generatePassword();
                const data = {
                    FirstName: userObj.firstName,
                    LastName: userObj.lastName,
                    Instructor: userObj.role === 'Instructor',
                    Role: userObj.role,
                    Email: userObj.email,
                    Password: password,
                    Active: userObj.active,
                    Volunteer: userObj.volunteer,
                    SectionID: req.params.sectionid,
                };

                const user = await userService.createUser(data, t);
                data.UserID = user.UserID;
                const login = await userService.createLogin(data, t);
                const contact = await userService.createContact(data, t);

                if (user != null && (login != null) & (contact != null)) {
                    const sectionUser = await sectionUserService.createSectionUser(data, t);

                    if (sectionUser != null) {
                        //TODO:Send email
                        Logger.info('SectionUserController::addManySectionUsers::New user created. UserID: ' + user.UserID);
                        return sectionUser;
                    } else {
                        Logger.error('SectionUserController::addManySectionUsers::Cannot create section user. Email: ' + userObj.email);
                        return res
                            .status(400)
                            .send(
                                await responseService.errorMessage(
                                    'SectionUserController::addManySectionUsers::Cannot create section user. Email: ' + userObj.email
                                )
                            );
                    }
                } else {
                    Logger.error('SectionUserController::addManySectionUsers::Cannot create user. Email: ' + userObj.email);
                    return res
                        .status(400)
                        .send(await responseService.errorMessage('SectionUserController::addManySectionUsers::Cannot create user. Email: ' + userObj.email));
                }
            } else {
                Logger.info('SectionUserController::addManySectionUsers::UserID: ' + userLogin.UserID);
                const sectionUser = await sectionUserService.findOneSectionUser({
                    SectionID: req.params.sectionid,
                    UserID: userLogin.UserID,
                });

                if (sectionUser != null) {
                    Logger.info('SectionUserController::addManySectionUsers::Section user already exist. SectionUserID: ' + sectionUser.SectionUserID);
                    return sectionUser;
                } else {
                    const t = await sequelize.transaction();
                    const newSectionUser = await sectionUserService.createSectionUser({
                        SectionID: req.params.sectionid,
                        UserID: userLogin.UserID,
                        Active: userObj.active,
                        Volunteer: userObj.volunteer,
                        Role: userObj.role,
                    });

                    if (newSectionUser != null) {
                        //TODO:Send email
                        Logger.info('SectionUserController::addManySectionUsers::SectionUserID: ' + newSectionUser.SectionUserID);
                        return newSectionUser;
                    } else {
                        Logger.error('SectionUserController::addManySectionUsers::Cannot create section user. Email: ' + userObj.email);
                        return res
                            .status(400)
                            .send(
                                await responseService.errorMessage(
                                    'SectionUserController::addManySectionUsers::Cannot create section user. Email: ' + userObj.email
                                )
                            );
                    }
                }
            }
        }).then(async (result) => {
            await t.commit();
            Logger.info('SectionUserController::addManySectionUsers::New section users created');
            return res.status(200).send(
                await responseService.successMessage({
                    success: true,
                    message: 'new users created',
                })
            );
        });
    } catch (e) {
        Logger.error('SectionUserController::addManySectionUsers::' + e);
        return res.status(500).send(await responseService.errorMessage('SectionUserController::addManySectionUsers::' + e));
    }
}
