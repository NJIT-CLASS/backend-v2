import { Router } from 'express';
import user from './routes/user';
import auth from './routes/auth';
import course from './routes/course';
import apiStatistics from './routes/api-statistics';
import notification from './routes/notification';
import semester from './routes/semester';
import section from './routes/section';

export default () => {
    const app = Router();
    apiStatistics(app);
    auth(app);
    course(app);
    notification(app);
    section(app);
    semester(app);
    user(app);

    return app;
};
