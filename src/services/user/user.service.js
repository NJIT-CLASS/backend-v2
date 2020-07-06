import bcrypt from 'bcrypt';
import config from '../../config';
import Logger from '../../loaders/logger';
import models from '../../models';
import emailService from '../_helper/email/email.service';
var { User, UserLogin, UserContact, sequelize } = models;

module.exports = {
    createContact,
    createLogin,
    createUser,
    findAll,
    findUser,
    findUserContact,
    findUserLogin,
    updateContact,
    updatePassword,
    updateLogin,
    updateUser,
};

async function createUser(userObject, t) {
    const user = await User.create(userObject, {
        transaction: t,
    });
    Logger.info('UserService::createUser::UserID:', user.UserID);
    return user;
}

async function createLogin(loginObject, t) {
    const saltRounds = 11;
    const password = await bcrypt.hash(loginObject.Password, saltRounds);
    loginObject.Password = password;
    const login = await UserLogin.create(loginObject, {
        transaction: t,
    });
    Logger.info('UserService::createLogin::UserID:' + login.UserID);
    return login;
}

async function createContact(contactObject, t) {
    const contact = await UserContact.create(contactObject, {
        transaction: t,
    });
    Logger.info('UserService::createContact::UserID:' + contact.UserID);
    return contact;
}

async function findUser(attributes) {
    const user = await User.findOne({
        where: attributes,
    });

    Logger.info('UserService::findUser::UserID:' + user.UserID);
    return user;
}

async function findAll() {
    const users = await User.findAll();
    Logger.info('UserService::findAll::count:' + users.length);
    return users;
}

async function findUserContact(attributes) {
    const contact = await UserContact.findOne({
        where: attributes,
    });
    Logger.info('UserService::findContact::UserID:' + contact.UserID);
    return contact;
}

async function findUserLogin(attributes) {
    const userLogin = await UserLogin.findOne({
        where: attributes,
    });
    Logger.info('UserService::findUserLogin::UserID:' + userLogin.UserID);
    return userLogin;
}

async function updateUser(userObject, t) {
    const { UserID, ...userObjectWithoutID } = userObject;
    const user = await User.update(
        userObjectWithoutID,
        {
            where: {
                UserID,
            },
        },
        {
            transaction: t,
        }
    );
    Logger.info('UserService::updateUser::UserID:', user.UserID);
    return user;
}

async function updatePassword(loginObject, t) {
    console.log(loginObject.Password);
    const saltRounds = 11;
    const password = await bcrypt.hash(loginObject.Password, saltRounds);
    const login = await UserLogin.update(
        {
            Password: password,
            Pending: true,
            Timeout: null,
            Attempts: 0,
        },
        {
            where: {
                UserID: loginObject.UserID,
            },
        },
        {
            transaction: t,
        }
    );
    Logger.info('UserService::updatePassword::UserID:' + login.UserID);
    return login;
}

async function updateLogin(loginObject, t) {
    const { UserID, ...loginObjectWithoutID } = loginObject;
    const login = await UserLogin.update(
        loginObjectWithoutID,
        {
            where: {
                UserID: UserID,
            },
        },
        {
            transaction: t,
        }
    );
    Logger.info('UserService::updateLogin::UserID:' + login.UserID);
    return login;
}

async function updateContact(contactObject, t) {
    const { UserID, ...contactObjectWithoutID } = userObject;
    const contact = await UserContact.update(
        contactObjectWithoutID,
        {
            where: {
                UserID: UserID,
            },
        },
        {
            transaction: t,
        }
    );
    Logger.info('UserService::updateContact::UserID:' + contact.UserID);
    return contact;
}
