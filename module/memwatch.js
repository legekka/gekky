// memwatch.js
// memory-leak watcher

var limit = 500;

module.exports = {
    start: (core) => {
        setInterval(() => {
            var memrss = process.memoryUsage().rss;
            if (memrss / 1024 / 1024 > limit) {
                console.log('Memory overload: ' + (memrss / 1024 / 1024).toFixed(2) + ' MB / ' + limit.toFixed(2) + " MB");
                if (core.ready) {
                    core.bot.channels.get(core.ch.gekkyerrorlog).send('Memory overload: ' + (memrss / 1024 / 1024).toFixed(2) + ' MB / ' + limit.toFixed(2) + " MB");
                    if (core.irc_online) {
                        reqreload('./osuirc.js').stop(core, message);
                        setTimeout(() => {
                            core.bot.destroy().then(() => {
                                process.exit(2);
                            });
                        }, 2000);
                    } else {
                        core.bot.destroy().then(() => {
                            process.exit(2);
                        })
                    }
                } else {
                    if (core.irc_online) {
                        reqreload('./osuirc.js').stop(core, message);
                        setTimeout(() => {
                            process.exit(2);
                        }, 2000);

                    } else {
                        process.exit(2);
                    }
                }
            }
            memrss = null;
        }, 1000);
    }
}