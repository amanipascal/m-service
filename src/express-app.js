import express from 'express';
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import path from 'path'
// import 'dotenv/config'
const cors  = require('cors');
const compression = require('compression')
const { todoApi, securityApi, mediaApi, redisPersonApi } = require('./api');
const HandleErrors = require('./utils/error-handler')


module.exports = async (app) => {

    app.use(cors());
    app.use(compression())
    app.use(express.json({ limit: '1mb'}));
    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false, limit: '1mb'}));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

    //api
    securityApi(app);
    todoApi(app);
    mediaApi(app);
    redisPersonApi(app);

    // error handling
    app.use(HandleErrors);
    
}