import expressLoader from './express';
import Logger from './logger';

const loader = async ({ expressApp }) => {
    await expressLoader({ app: expressApp });
    Logger.info('Express Initialized');
};

export default loader;
