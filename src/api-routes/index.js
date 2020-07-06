import { Router } from 'express';
import user from './routes/user';
import auth from './routes/auth';
import apiStatistics from './routes/api-statistics';

export default () => {
    const app = Router();
    apiStatistics(app);
    auth(app);
    user(app);

    return app;
};
