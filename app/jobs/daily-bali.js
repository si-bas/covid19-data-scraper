const cron = require("node-cron");
const baliService = require('./../services/bali');

const run = async () => {
    cron.schedule("5 4 * * *", function() {
        baliService.scraper();
    });
}

module.exports = {
    run
}