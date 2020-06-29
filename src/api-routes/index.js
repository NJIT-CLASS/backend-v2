import { Router } from 'express';
import user from './routes/user';
import apiStatistics from './routes/api-statistics';

export default () => {
    const app = Router();
    apiStatistics(app);
    user(app);

    return app;
};
