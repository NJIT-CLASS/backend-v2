import { sequelize } from '../../models';

module.exports = {
    errorMessage,
    successMessage,
};

async function errorMessage(message) {
    return {
        Error: true,
        Message: message,
    };
}

async function successMessage(data) {
    return {
        Error: false,
        Message: 'Success',
        Data: data,
    };
}
