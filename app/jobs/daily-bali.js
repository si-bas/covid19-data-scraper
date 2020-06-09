const cron = require("node-cron");

const run = async () => {
    cron.schedule("* * * * *", function() {
        console.log("running a task every minute");
    });
}

module.exports = {
    run
}