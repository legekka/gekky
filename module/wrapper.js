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
    sync: (core) => {
        WR('Syncing...');
        var db = JSON.parse(fs.readFileSync('../wrapper/sankakudb.json'));
        var next = 0;
        var divider = 10;
        var k = 1;
        for (i in db) {
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
                WR(Math.round(i / db.length * 100) + '% complete');
                next = db.length / divider * k;
                k++;
            }
        }
        WR('Sync complete!');
    }
}


function WR(text) {
    console.log(c.magenta('[Wrapper] ') + text);
}