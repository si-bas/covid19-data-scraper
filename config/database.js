require('dotenv').config();
const Sequelize = require('sequelize');

const {
    DB_CONNECTION,
    DB_HOST,
    DB_PORT,
    DB_DATABASE,
    DB_USERNAME,
    DB_PASSWORD
} = process.env;

const sequelize = new Sequelize(DB_DATABASE, DB_USERNAME, DB_PASSWORD, {
    host: DB_HOST || 'localhost',
    port: DB_PORT || '3306',
    dialect: DB_CONNECTION || 'mysql',
    define: {
        underscored: true
    },
    logging: false
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection hasexit been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = {
    Sequelize,
    sequelize
};