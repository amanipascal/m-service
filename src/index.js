const express = require('express');
const { SERVER_PORT } = require('./config');
const expressApp = require('./express-app.js');


const { databaseConnection } = require('./database');

const StartServer = async () => {

    const app = express();
    
    await databaseConnection();
    // connectDB()

    await expressApp(app);

    app.get('/test', async (req, res) => {
        res.json({ status: true, message: "Our node.js app works" })
    });

    app.listen(SERVER_PORT, () => {
        console.log(`listening to port ${SERVER_PORT}`);
    })
    .on('error', (err) => {
        console.log(err);
        process.exit();
    })
}

StartServer();
