require('dotenv').config();
const moment = require('moment');

const {
    APP_NAME,
    APP_ENV,
    APP_URL,
    APP_PORT,

    START_DATE
} = process.env;

const date = moment(new Date()).format("YYYY-MM-DD");

module.exports = {
    app: {
        name: APP_NAME || 'NodeJS',
        env: APP_ENV || 'development',
        url: APP_URL || 'http://localhost/',
        port: APP_PORT || '8080'
    },

    date: {
        start: START_DATE || datetime.toISOString().slice(0,10) 
    }
}