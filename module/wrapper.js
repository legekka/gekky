// wrapper.js
// sitewrapper host for waifucloud

var exec = require('child_process').exec;
var reqreload = require('./reqreload.js');
var fs = require('fs');
var c = require('chalk');

var wrapper;
var wrapperpath = '../wrapper/index.js';

module.exports = {
    wrap: (core, mode, tag) => {
        console.log('starting wrapper...')
        wrapper = exec(`cd.. && cd wrapper && node ${wrapperpath} "${mode}" "${tag}"`);
        wrapper.stdout.on('data', (d) => {
            var data = d.trim();
            if (data[0] == '$') {
                var post = JSON.parse(data.substr(1));
                WR('Sending post: ' + post.url);
                reqreload('./waifucloud.js').addPost(core, post);
            } else {
                WR(data);
            }
        });
    },
    sync: (core, message) => {
        WR('Syncing...');
        var proc = undefined;
        core.waifucloud.sync = false;
        if (message != undefined) {
            message.channel.send('Syncing `[..........]`').then((response) => {
                var proc = response;
                var db = JSON.parse(fs.readFileSync('../wrapper/sankakudb.json'));
                var next = 0;
                var divider = 10;
                var k = 1;
                slowCycle(0, db.length, db, proc, next, divider, k, core);
                var itv = setInterval(() => {
                    if (core.waifucloud.sync) {
                        WR('Sync complete!');
                        proc.edit('Sync complete!');
                        clearInterval(itv);
                    }
                }, 1000);
            });
        } else {
            var db = JSON.parse(fs.readFileSync('../wrapper/sankakudb.json'));
            var next = 0;
            var divider = 10;
            var k = 1;
            slowCycle(0, db.length, db, proc, next, divider, k, core);
            var itv = setInterval(() => {
                if (core.waifucloud.sync) {
                    WR('Sync complete!');
                    clearInterval(itv);
                }
            }, 1000);
        }
        
        /*for (i in db) {
            if (db[i].filename != "") {
                var WaifuCloudPost = {
                    url: 'https://chan.sankakucomplex.com/post/show/' + db[i].id,
                    tags: db[i].tags,
                    filename: db[i].filename,
                    filepath: db[i].filepath
                }
                reqreload('./waifucloud.js').addPost(core, WaifuCloudPost);
            }
            if (i > next) {
                if (proc != undefined) {
                    proc.edit('teszt: ' + k);
                }
                WR(Math.round(i / db.length * 100) + '% complete');
                next = db.length / divider * k;
                k++;
            }
        }*/

    }
}

function slowCycle(i, limit, array, proc, next, divider, k, core) {
    if (i < limit) {
        setTimeout(() => {
            toDo(array, i, proc, next, divider, k, core, (i, proc, next, divider, k, core) => {
                return slowCycle(i + 1, limit, array, proc, next, divider, k, core);
            });
        }, 1);
    } else {
        core.waifucloud.sync = true;
        return;
    }
}
function toDo(array, i, proc, next, divider, k, core, callback) {
    if (array[i].filename != "") {
        var WaifuCloudPost = {
            url: 'https://chan.sankakucomplex.com/post/show/' + array[i].id,
            tags: array[i].tags,
            filename: array[i].filename,
            filepath: array[i].filepath
        }
        reqreload('./waifucloud.js').addPost(core, WaifuCloudPost);
    }
    if (i > next) {
        if (proc != undefined) {
            var str = '`[';
            var l = 0;
            while (l < k - 1) {
                str += 'O';
                l++;
            }
            var l = 0;
            while (l < divider - k + 1) {
                str += '.';
                l++;
            }
            str += ']`';
            proc.edit('Syncing ' + str);
        }
        WR(Math.round(i / array.length * 100) + '% complete');
        next = array.length / divider * k;
        k++;
    }
    return callback(i, proc, next, divider, k, core)
}
function WR(text) {
    console.log(c.magenta('[Wrapper] ') + text);
}