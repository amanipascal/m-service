// const dotenv = require("dotenv");
import dotenv from 'dotenv'
dotenv.config()

module.exports = {
    SERVER_PORT: process.env.SERVER_PORT,
    DB_URL: process.env.DB_URI,
    BCRYPT_SALT: process.env.BCRYPT_SALT,
    EMAIL_HOST: process.env.EMAIL_HOST,
    EMAIL_USERNAME: process.env.EMAIL_USERNAME,
    EMAIL_PORT: process.env.EMAIL_PORT,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    FROM_EMAIL: process.env.FROM_EMAIL,
    DB_URL: process.env.DB_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    TOKEN_EXPIRES_IN: process.env.TOKEN_EXPIRES_IN,
    REGISTER_COMPLETION_TIMES: process.env.REGISTER_COMPLETION_TIMES,
    CLIENT_URL: process.env.CLIENT_URL,
    REDIS_URL: process.env.REDIS_URL,
    DF_URL: process.env.DF_URL,
    API_PREFIX: process.env.API_PREFIX
};