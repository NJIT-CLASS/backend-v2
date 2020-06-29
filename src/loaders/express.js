import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';

import config from '../config';
import routes from '../api-routes';

const expressLoader = async ({ app }) => {
    app.get('/status', (req, res) => {
        res.status(200).end();
    });
    app.head('/status', (req, res) => {
        res.status(200).end();
    });
    app.enable('trust proxy');

    app.use(cors());
    app.use(morgan('dev'));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    //load API routes
    app.use(config.api.prefix, routes());

    ///catch 404 and forward to error handler
    app.use((req, res, next) => {
        const err = new Error('Not Found');
        err['status'] = 404;
        next(err);
    });

    //error handler
    app.use((err, req, res, next) => {
        //Handle 401 thrown by express-jwt library
        if (err.name === 'UnauthorizedError') {
            return res.status(err.status).send({ message: err.message }).end();
        }
        return next(err);
    });
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.json({
            errors: {
                message: err.message,
            },
        });
    });

    //return the express app
    return app;
};

export default expressLoader;
