import userService from '../user/user.service';
import authService from './auth.service';
import responseService from '../_helper/response.service';
import { sequelize } from '../../models';
import Logger from '../../loaders/logger';
import { response } from 'express';

module.exports = {
    authenticate,
    refreshToken,
    resetPassword,
};

async function authenticate(req, res, next) {
    try {
        if (req.body.emailaddress == null || req.body.password == null) {
            Logger.info(e);
            res.status(400).send(await responseService.errorMessage('Email or password is null'));
        }

        const data = await authService.authenticate(req.body);
        if (data !== null) {
            const { userLogin, checkPassword } = data;
            const isBlocked = userLogin.Blocked; // check if user manually blocked
            const isTimeout = userLogin.Timeout != null && userLogin.Timeout > current_timestamp ? true : false; //check if there is a timeout to prevent user login
            let current_timestamp = new Date(); // get current time of login

            if (isBlocked) {
                Logger.info('AuthController::authenticate::User is blocked. UserID:' + userLogin.UserID);
                return res.status(400).send({
                    Error: true,
                    Message: 'Timeout',
                    Timeout: 60,
                });
            } else if (isTimeout) {
                let timeOut = new Date(userLogin.Timeout) - new Date();
                timeOut = Math.ceil(timeOut / 1000 / 60);
                Logger.info('AuthController::authenticate::User timeout for ' + timeOut + 'minutes. UserID:' + userLogin.UserID);
                return res.status(400).send(
                    await responseService.errorMessage({
                        Error: true,
                        Message: 'Timeout',
                        Timeout: timeOut,
                    })
                );
            } else if (!checkPassword) {
                let attempts = userLogin.Attempts + 1;
                let minutes = 0;
                let update_data = {
                    Attempts: attempts,
                    UserID: userLogin.UserID,
                };

                Logger.info('AuthController::authenticate::Password does not match. Current Attempt: ' + attempts + ' UserID:' + userLogin.UserID);

                // calculate timeout if five or more attempts
                // timeout is calculated relative to current time, not relative to previous timeout,
                // this is done by design
                if (attempts >= 5) {
                    Logger.info('AuthController::authenticate::Setting new timeout for ', userLogin.Email);
                    switch (attempts) {
                        case 5:
                            minutes = 1;
                            break;
                        case 6:
                            minutes = 2;
                            break;
                        case 7:
                            minutes = 5;
                            break;
                        case 8:
                            minutes = 10;
                            break;
                        case 9:
                            minutes = 15;
                            break;
                        case 10:
                            minutes = 30;
                            break;
                        default:
                            minutes = 60;
                    }
                    let timeout = current_timestamp;
                    timeout.setMinutes(timeout.getMinutes() + minutes);
                    update_data.Blocked = attempts > 10;
                    update_data.Timeout = timeout;
                }

                await userService.updateLogin(update_data);

                return res.status(400).send({
                    Error: true,
                    Message: 'Timeout',
                    Timeout: minutes,
                });
            }

            Logger.info('AuthController::authenticate::UserID: ' + userLogin.UserID);
            return res.status(201).json(
                await responseService.successMessage({
                    Error: false,
                    Message: 'Success',
                    UserID: userLogin.UserID,
                    Pending: userLogin.Pending,
                    Token: data.token,
                    RefreshToken: data.refreshToken,
                })
            );
        } else {
            return res.status(400).json(await responseService.errorMessage('AuthController::authenticate::User not found'));
        }
    } catch (e) {
        Logger.error('AuthController::authenticate::' + e);
        return res.status(500).send(await responseService.errorMessage('AuthController::authenticate::' + e));
    }
}

async function refreshToken(req, res, next) {
    try {
        const token = await authService.refreshToken(req);

        if (token == null) {
            return res.status(400).send(await responseService.errorMessage('AuthController::refreshToken::Refresh token expired. UserID: ' + req.body.UserID));
        }
        return res.status(200).send(
            await responseService.successMessage({
                Token: token,
            })
        );
    } catch (e) {
        Logger.error('AuthController::refreshToken::' + e);
        return res.status(400).send(await responseService.errorMessage('AuthController::refreshToken::' + e));
    }
}

async function resetPassword(req, res, next) {
    try {
        if (req.body.email === null || req.body.email === '') {
            return res.status(400).send(await errorService.errorMessage('AuthController::resetPassword::Email or password is null'));
        }

        let userLogin = await userService.findOneUserLogin({
            Email: req.body.email,
        });

        if (userLogin == null) {
            return res.status(400).send(await errorService.errorMessage('AuthController::resetPassword::Cannot find user with email: ' + req.body.email));
        }
        var temp_pass = authService.generatePassword();
        userLogin.Password = temp_pass;
        userLogin = await userService.updatePassword(userLogin);

        return res.status(201).send(await responseService.successMessage(userLogin));
    } catch (e) {
        Logger.error('AuthController::resetPassword::' + e);
        return res.status(500).send(await responseService.errorMessage('AuthController::resetPassword::' + e));
    }
}
