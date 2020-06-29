import express from 'express';
import loaders from './loaders';

var app = express();
loaders({ expressApp: app });

export default app;
