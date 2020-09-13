import models from '../../models';
import Logger from '../../loaders/logger';
var { FileReference, sequelize } = models;

module.exports = {
    createFileReference,
    findOneFileReference,
    findAllFileReferences,
    updateFileReference,
    deleteFileReference,
};

async function createFileReference(fileReferenceObject, t) {
    const fileReference = await FileReference.create(fileReferenceObject, {
        transaction: t,
    });

    if (fileReference == null) {
        Logger.info('FileReferenceService::createFileReference::File reference not found');
        return null;
    } else {
        Logger.info('FileReferenceService::createFileReference::FileID: ' + fileReference.FileID);
        return fileReference;
    }
}

async function findOneFileReference(attributes) {
    const fileReference = await FileReference.findOne({
        where: attributes,
    });

    if (fileReference == null) {
        Logger.info('FileReferenceService::findOneFileReference::File reference not found');
        return null;
    } else {
        Logger.info('FileReferenceService::findOneFileReference::FileID: ' + fileReference.FileID);
        return fileReference;
    }
}

async function findAllFileReferences(attributes) {
    const fileReference = await FileReference.findAll({
        where: attributes,
    });

    if (fileReference == null) {
        Logger.info('FileReferenceService::findAllFileReferences::File reference not found');
        return null;
    } else {
        Logger.info('FileReferenceService::findAllFileReferences::Count: ' + fileReference.length);
        return fileReference;
    }
}

async function updateFileReference(fileReferenceObject, t) {
    const { FileID, ...fileReferenceObjectWithoutID } = fileReferenceObject;
    const fileReference = await FileReference.update(fileReferenceObjectWithoutID, {
        where: {
            FileID: FileID,
        },
        transaction: t,
    });
    Logger.info('FileReferenceService::updateFileReference::FileID: ' + fileReference.FileID);
    return fileReference;
}

async function deleteFileReference(attributes, t) {
    const fileReference = await FileReference.destroy({
        where: attributes,
        transaction: t,
    });

    if (fileReference == null) {
        Logger.info('FileReferenceService::deleteFileReference::Cannot delete file reference');
        return null;
    } else {
        Logger.info('FileReferenceService::deleteFileReference::Deleted file reference');
        return fileReference;
    }
}
