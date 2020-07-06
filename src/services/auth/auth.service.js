import jwt from 'jsonwebtoken';
const expressJwt = require('express-jwt');
import bcrypt from 'bcrypt';
import config from '../../config';
import Logger from '../../loaders/logger';
import models from '../../models';
import emailService from '../_helper/email/email.service';
import dateService from '../_helper/date.service';
import userService from '../user/user.service';
import { uid } from 'rand-token';

var { User, UserLogin, sequelize } = models;

module.exports = {
    authorize,
    authenticate,
};

//In-memory object to store refresh tokens
const refreshTokens = {};

async function authorize(roles = []) {
    const secret = config.secret;
    // roles param can be a single role string (e.g. Role.User or 'User')
    // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        // authenticate JWT token and attach user to request object (req.user)
        expressJwt({ secret }),

        // authorize based on user role
        (req, res, next) => {
            if (roles.length && !roles.includes(req.user.role)) {
                // user's role is not authorized
                return res.status(401).json({ message: 'Unauthorized' });
            }

            // authentication and authorization successful
            next();
        },
    ];
}

//TODO: Change emailaddress to email
async function authenticate({ emailaddress, password }) {
    const userLogin = await UserLogin.findOne({
        where: {
            Email: emailaddress,
        },
        attributes: ['UserID', 'Email', 'Password', 'Pending', 'Attempts', 'Timeout', 'Blocked'],
        include: [
            {
                model: User,
                attributes: ['UserID', 'Admin', 'Instructor', 'Role'],
            },
        ],
    });

    if (userLogin === null) {
        return null;
    }

    const user = userLogin.User;
    const checkPassword = await bcrypt.compare(password, userLogin.Password);
    if (checkPassword) {
        if (user) {
            const currTime = new Date();
            currTime.setHours(currTime.getHours());

            userService.updateLogin({
                Attempts: 0,
                Timeout: null,
                LastLogin: currTime.toLocaleString(),
                UserID: user.UserID,
            });

            const token = await jwt.sign({ admin: user.Admin, instructor: user.Instructor, id: user.UserID, role: user.Role }, config.secret, {
                expiresIn: config.tokenLife,
            });

            const refreshToken = uid(256);
            refreshTokens[refreshToken] = [dateService.addDays(config.refreshTokenLife), user.UserID];

            Logger.info('UserService::authenticate::UserID:' + user.UserID);
            return {
                refreshToken,
                token,
                userLogin,
                checkPassword,
            };
        }
    } else {
        return {
            userLogin,
            checkPassword,
        };
    }
}
