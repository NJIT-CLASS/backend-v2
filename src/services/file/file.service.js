import models from '../../models';
import Logger from '../../loaders/logger';
var { FileReference, sequelize } = models;

module.exports = {
    addFileRef,
    addFileRefs,
};

/*
     Add uploaded files' references
     */
async function addFileRefs(file_infos, user_id) {
    Logger.info('add file references', {
        user_id: user_id,
        file_infos: file_infos,
    });
    var me = this;
    return Promise.all(
        file_infos.map(function (file_info) {
            return me.addFileRef(user_id, file_info);
        })
    ).then(function (file_refs) {
        logger.log('info', 'file references added', {
            file_refs: file_refs.map(function (it) {
                return it.toJSON();
            }),
        });
        return file_refs;
    });
}

/*
    Add a new file reference
     */
async function addFileRef(user_id, file_info) {
    Logger.info('add file', {
        user_id: user_id,
        file_info: file_info,
    });

    return FileReference.create({
        UserID: user_id,
        Info: file_info,
        LastUpdated: new Date(),
    })
        .then(function (file_ref) {
            logger.log('debug', 'file reference added', file_ref.toJSON());
            return file_ref;
        })
        .catch(function (err) {
            logger.log('error', 'add file reference failed', err);
            return err;
        });
}
