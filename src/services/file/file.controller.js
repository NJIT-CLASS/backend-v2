import { Promise } from 'bluebird';
import config from '../../config';
import Logger from '../../loaders/logger';
import responseService from '../_helper/response.service';
import models, { sequelize } from '../../models';

import fileReferenceService from './file.service';
import taskInstanceService from '../assignment/task/task-instance.service';
import userService from '../user/user.service';

module.exports = {
    downloadFile,
    deleteFile,
    uploadFile,
    uploadFiles,
};

async function uploadFile(req, res, next) {
    try {
        const t = await sequelize.transaction();
        const fileReference = await fileReferenceService.createFileReference(
            {
                UserID: req.body.userId,
                Info: req.body.fileInfo,
                LastUpdated: new Date(),
            },
            t
        );

        switch (req.params.type) {
            case 'task':
                const ti = await taskInstanceService.findOneTaskInstance({
                    TaskInstanceID: req.body.taskInstanceId,
                });

                let newFilesArray = JSON.parse(ti.Files) || [];
                newFilesArray = newFilesArray.concat(fileReference.FileID);

                // Update task instance with the new file references
                const updatedTi = await taskInstanceService.updateTaskInstance({
                    Files: newFilesArray,
                    TaskInstanceID: req.body.taskInstanceId,
                });

                if (updatedTi != null) {
                    await t.commit();
                    // Respond wtih file info
                    return res.status(200).json(
                        await responseService.successMessage({
                            FileID: fileReference.FileID,
                        })
                    );
                }
                break;
            case 'profile-picture':
                const updatedUserContact = await userService.updateContact({
                    ProfilePicture: fileReference.FileID,
                    UserID: req.body.userId,
                });

                if (updatedUserContact != null) {
                    await t.commit();
                    // respond with file info
                    return res.status(200).json(
                        await responseService.successMessage({
                            FileID: fileReference.FileID,
                        })
                    );
                }
                break;
            default:
                return res.status(200).json(
                    await responseService.successMessage({
                        Message: 'Done',
                    })
                );
                break;
        }
    } catch (e) {
        Logger.error('FileReferenceController::uploadFile::' + e);
        return res.status(500).send(await responseService.errorMessage('FileReferenceController::uploadFile::' + e));
    }
}

async function uploadFiles(req, res, next) {
    try {
        let successfulFiles = [];
        let unsuccessfulFiles = [];
        const t = await sequelize.transaction();

        var results = await Promise.mapSeries(req.body.files, async (file) => {
            const fileReference = await fileReferenceService.createFileReference(
                {
                    UserID: req.body.userId,
                    Info: file,
                    LastUpdated: new Date(),
                },
                t
            );

            if (fileReference != null) {
                successfulFiles.push(file);
                return { File: file, FileID: fileReference.FileID };
            } else {
                unsuccessfulFiles.push(file);
                return { File: file, Error: err };
            }
        });

        let newFileIDs = results.map((instanceInfo) => instanceInfo.FileID);

        switch (req.params.type) {
            case 'task':
                const ti = await taskInstanceService.findOneTaskInstance({
                    TaskInstanceID: req.body.taskInstanceId,
                });

                let newFilesArray = JSON.parse(ti.Files) || [];
                newFilesArray = newFilesArray.concat(newFileIDs);

                // Update task instance with the new file references
                const updatedTi = await taskInstanceService.updateTaskInstance({
                    Files: newFilesArray,
                    TaskInstanceID: req.body.taskInstanceId,
                });

                if (updatedTi != null) {
                    await t.commit();
                    // Respond wtih file info
                    return res.status(200).json(
                        await responseService.successMessage({
                            SuccessfulFiles: successfulFiles,
                            UnsuccessfulFiles: unsuccessfulFiles,
                        })
                    );
                }
                break;
            case 'profile-picture':
                const updatedUserContact = await userService.updateContact({
                    ProfilePicture: newFileIDs[0],
                    UserID: req.body.userId,
                });

                if (updatedUserContact != null) {
                    await t.commit();
                    // respond with file info
                    return res.status(200).json(
                        await responseService.successMessage({
                            SuccessfulFiles: successfulFiles,
                            UnsuccessfulFiles: unsuccessfulFiles,
                        })
                    );
                }
                break;
            default:
                return res.status(200).json(
                    await responseService.successMessage({
                        Message: 'Done',
                    })
                );
                break;
        }
    } catch (e) {
        Logger.error('FileReferenceController::uploadFiles::' + e);
        return res.status(500).send(await responseService.errorMessage('FileReferenceController::uploadFiles::' + e));
    }
}

async function downloadFile(req, res, next) {
    try {
        if (req.params.fileId == null) {
            Logger.error('FileReferenceController::downloadFile:: FileID is empty');
            return res.status(400).send(await responseService.errorMessage('FileReferenceController::downloadFile:: FileID is empty'));
        }

        const file = await fileReferenceService.findOneFileReference({
            FileID: req.params.fileId,
        });

        if (file == null) {
            Logger.error('FileReferenceController::downloadFile:: Cannot find file reference');
            return res.status(400).send(await responseService.errorMessage('FileReferenceController::downloadFile:: Cannot find file reference'));
        } else {
            Logger.info('FileReferenceController::downloadFile:: FileID: ' + file.FileID);
            return res.status(200).json(await responseService.successMessage(file));
        }
    } catch (e) {
        Logger.error('FileReferenceController::downloadFile::' + e);
        return res.status(500).send(await responseService.errorMessage('FileReferenceController::downloadFile::' + e));
    }
}

async function deleteFile(req, res, next) {
    try {
        let taskId = req.body.taskId || '';
        var userId = req.body.userId;
        if (userId === null || userId === '') {
            Logger.error('FileReferenceController::deleteFile:: UserID is empty');
            return res.status(400).send(await responseService.errorMessage('FileReferenceController::deleteFile:: UserID is empty'));
        }

        const t = await sequelize.transaction();
        const file = await fileReferenceService.findOneFileReference({ FileID: req.params.fileId, UserID: userId });
        const deletedFile = await fileReferenceService.deleteFileReference({ FileID: req.params.fileId, UserID: userId }, t);

        if (taskId !== '') {
            const ti = await taskInstanceService.findOneTaskInstance({
                TaskInstanceID: taskId,
            });
            if (ti != null) {
                let fileArray = ti.Files;
                fileArray = JSON.parse(fileArray);
                fileArray.splice(fileArray.indexOf(req.body.fileId), 1);
            } else {
                Logger.error('FileReferenceController::deleteFile:: Task instance is not found');
                return res.status(400).send(await responseService.errorMessage('FileReferenceController::deleteFile:: Task instance is not found'));
            }

            const updatedTi = await taskInstanceService.updateTaskInstance(
                {
                    Files: fileArray,
                    TaskInstanceID: taskId,
                },
                t
            );

            if (updatedTi == null) {
                Logger.error('FileReferenceController::deleteFile:: Cannot update task instance');
                return res.status(400).send(await responseService.errorMessage('FileReferenceController::deleteFile:: Cannot update task instance'));
            }
        }

        if (deletedFile != null) {
            await t.commit();
            Logger.info('FileReferenceController::deleteFile:: FileID: ' + file.FileID);
            return res.status(200).json(await responseService.successMessage(file));
        } else {
            Logger.error('FileReferenceController::deleteFile:: Cannot delete file. File: ' + req.params.fileId);
            return res
                .status(400)
                .send(await responseService.errorMessage('FileReferenceController::deleteFile:: Cannot delete file. File: ' + req.params.fileId));
        }
    } catch (e) {
        Logger.error('FileReferenceController::deleteFile::' + e);
        return res.status(500).send(await responseService.errorMessage('FileReferenceController::deleteFile::' + e));
    }
}
