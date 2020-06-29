import nodemailer from 'nodemailer';
import Email from 'email-templates';
import config from '../../../config';
import Logger from '../../../loaders/logger.js';
import userService from '../../user/user.service';

Logger.info('Email Server Status: ' + config.emailServerStatus);

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.email,
        pass: config.emailPass,
    },
});

const email = new Email({
    views: { root: __dirname + '/templates', options: { extension: 'ejs' } },
    message: {
        from: 'Participatory Learning',
    },
    preview: false,
    send: true,
    transport: transporter,
});

exports.send = async (template, data = null) => {
    try {
        email.send({
            template: template,
            message: {
                to: data.UserID,
            },
            locals: data,
        });
    } catch (e) {
        Logger.error(e);
    }
};
