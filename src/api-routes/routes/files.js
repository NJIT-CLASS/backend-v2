import express from 'express';
import fileController from '../../services/file/file.controller';
import { FILE_SIZE as file_size, MAX_NUM_FILES as max_files } from '../../constants/constants';

var router = express.Router();

export default async (app) => {
    app.use('/', router);
    //upload one file
    router.post('/file/upload/:type?', fileController.uploadFile);
    //upload multiple files
    router.post('/files/upload/:type?', fileController.uploadFiles);
    //download a file
    router.get('/file/download/:fileId', fileController.downloadFile);
    //delete a file
    router.delete('/file/delete/:fileId', fileController.deleteFile);
};
