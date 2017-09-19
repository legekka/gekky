// cachemanager.js
// managing cache folder and keeping size under the limit

var cachemanager = {
    path: config.cachemanager.path,
    start: (core) => {
        setInterval(() => { cachemanager.manageSize(core.cachelimit) }, 1800000);
    },
    check: (core, message) => {
        cachemanager.checkSize(core.cachelimit, (size) => {
            if (message != undefined) {
                message.channel.send('Cache folder size: ' + size + '/' + core.cachelimit + ' Mb')
            }
            console.log('Cache folder size: ' + size + '/' + core.cachelimit + ' Mb')
        })
    },
    del: (message) => {
        if (message != undefined) {
            message.channel.send('Clearing...');
        }
        cachemanager.delCache();
        if (message != undefined) {
            message.channel.send('Cache deleted.');
        }
        console.log('Cache deleted.');
    },
    delCache: () => {
        console.log('Clearing...');
        fs.readdir(path, (err, files) => {
            if (err) { return; }
            for (const file of files) {
                fs.unlink(path + file, err => {
                    if (err) { return; }
                });
            }
            return;
        });
    },
    checkSize: (limit, callback) => {
        getSize(path, (err, size) => {
            if (err) { throw err; }
            var mb = size / 1024 / 1024;
            var mbtext = mb.toFixed(2);
            console.log('Cache folder size: ' + mbtext + '/' + limit + ' Mb');
            return callback(mbtext);
        });
    },
    manageSize: (limit) => {
        getSize(path, (err, size) => {
            if (err) { throw err; }
            var mb = size / 1024 / 1024;
            var mbtext = mb.toFixed(2);
            console.log('Cache folder size: ' + mbtext + '/' + limit + ' Mb');
            if (mb > limit) {
                console.log('Clearing...');
                fs.readdir(path, (err, files) => {
                    //if (err) { throw err; }
                    for (const file of files) {
                        fs.unlink(path + file, err => {
                            //if (err) { throw err; }
                        });
                    }
                });
            }
        });
    }
}