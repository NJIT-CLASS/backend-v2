import express from 'express';
import apiStatisticsService from '../../services/api-statistics/api-statistics.service';

var router = express.Router();

export default async (app) => {
    app.use('/', router);
    // router.use(apiStatisticsService.apiStatistics);
    // router.use(apiStatisticsService.updateAPIStatistics);
};
