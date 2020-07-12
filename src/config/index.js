import dotenv from 'dotenv';
//config() will read your .env file, parse the contents, assign it to process.env

const envFound = dotenv.config();
if (!envFound) {
    //this error should crash whole process

    throw new Error("##  Couldn't find .env file  ##");
}

module.exports = {
    port: process.env.PORT,
    frontendPort: process.env.FRONTEND_PORT,
    databaseURL: process.env.DATABASE_URL,
    dbName: process.env.DB_NAME,
    dbUser: process.env.DB_USER,
    dbPass: process.env.DB_PASS,
    email: process.env.SERVER_EMAIL,
    emailPass: process.env.EMAIL_PASSWORD,
    emailServerStatus: process.env.EMAIL_SERVER_STATUS,
    forceSync: process.env.FORCE_SYNC,
    api: {
        prefix: process.env.PREFIX,
    },
    logs: {
        level: process.env.LOG_LEVEL || 'silly',
    },
    tokenLife: process.env.TOKEN_LIFE || '6h',
    refreshTokenLife: process.env.REFRESH_TOKEN_LIFE || 14,
    maxFileSize: 16 * 1024 * 1024, //16 MB
    imagePath: './public/images',
    secret: process.env.SECRET,
};
