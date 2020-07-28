import { Router } from 'express';
import user from './routes/user';
import auth from './routes/auth';
import course from './routes/course';
import apiStatistics from './routes/api-statistics';
import notification from './routes/notification';
import semester from './routes/semester';
import section from './routes/section';
import organization from './routes/organization';
import sectionUser from './routes/section-user';
import assignment from './routes/assignment';

export default () => {
    const app = Router();
    apiStatistics(app);
    auth(app);
    course(app);
    organization(app);
    notification(app);
    assignment(app);
    section(app);
    sectionUser(app);
    semester(app);
    user(app);

    return app;
};
