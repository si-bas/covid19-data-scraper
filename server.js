const express = require('express');
const glob = require( 'glob' );
const path = require("path");
const fs = require("fs");

const app = express();

const config = require('./config/environment');
const jobs = require('./app/jobs/job');
const {
    handleError,
    ErrorHandler
} = require('./helpers/error');

const port = config.app.port;

app.use(express.json());

glob.sync( './routes/**/*.js' ).forEach( function( file ) {
    app.use(require(path.resolve(file)));
});

app.get('/', (req, res) => {
    return res.status(200).json('Hello world');
});

app.get('/error', (req, res) => {
    throw new ErrorHandler(500, 'Internal server error');
});

app.use((err, req, res, next) => {
    handleError(err, res);
});

// jobs();

app.listen(port, () => console.log(`server listening at port ${port}`))
