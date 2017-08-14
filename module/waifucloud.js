// waifucloud.js
// test-brige for waifucloud

var fs = require('fs');
var c = require('chalk');
var EventEmitter = require('events');
var WebSocketClient = require('websocket').client;
var reqreload = require('./reqreload.js');

var username = "gekky";
var password = fs.readFileSync("D:/waifucloud/waifucloud/password.txt").toString().trim();
var serverip = 'ws://127.0.0.1:4243/';

module.exports = {
    start: (core) => {
        core.waifucloud.client = new WebSocketClient();
        core.waifucloud.client.on('connectFailed', function (error) {
            WC('Connect Error: ' + error.toString());
        });

        core.waifucloud.client.on('connect', function (connection) {
            core.waifucloud.connection = connection;
            core.waifucloud.waifuEmitter = new EventEmitter()
            WC('connected');

            core.waifucloud.connection.on('message', function (message) {
                if (message.type === 'utf8') {
                    //WC(message.utf8Data);
                    var resp = JSON.parse(message.utf8Data);
                    if (resp.name == 'post') {
                        WC('POST');
                        core.waifucloud.waifuEmitter.emit('post', resp.error, resp.response);
                    } else if (resp.name == 'stats') {
                        WC('STATS');
                        core.waifucloud.waifuEmitter.emit('stats', resp.response);
                    }
                }
            });

            core.waifucloud.connection.on('error', function (error) {
                WC("Connection Error: " + error.toString());
            });

            core.waifucloud.connection.on('close', function () {
                WC('disconnected');
                core.waifucloud.connection = undefined;
                core.waifucloud.waifuEmitter = undefined;
            });
        });


        core.waifucloud.client.connect(serverip, 'echo-protocol', JSON.stringify({
            "username": username,
            "password": password
        }));
    },
    connect: (core) => {
        if (core.waifucloud.connection == undefined) {
            core.waifucloud.client.connect(serverip, 'echo-protocol', JSON.stringify({
                "username": username,
                "password": password
            }));
        } else {
            WC("is connected already");
        }
    },
    dataCount: (core) => {
        sendCommand(core, {
            name: 'data_count',
            job_id: 'teszt'
        })
    },
    teszt2: (core) => {
        sendCommand(core, {
            name: 'add_post',
            post: JSON.parse(fs.readFileSync('../tesztpost.json').toString().trim()),
            job_id: 'teszt2'
        });
    },
    save: (core) => {
        sendCommand(core, {
            name: 'save',
            job_id: 'teszt3',
        });
    },
    searchAllFilePath: (core) => {
        sendCommand(core, {
            name: 'search_filepath',
            mode: 'all',
            job_id: 'teszt4'
        });
    },
    search_tags: (core, mode, tags, message) => {
        WC('image search: ' + tags);
        sendCommand(core, {
            name: 'search_tags',
            mode: mode,
            tags: tags,
            job_id: 'teszt5'
        });
        core.waifucloud.waifuEmitter.once('post', (err, post) => {
            if (err) {
                console.log(post);
                if (message != undefined) {
                    message.channel.send('Nincs találat...');
                }
            } else {
                if (message != undefined) {
                    reqreload('./webpconvert.js').file(post.filepath, (converted_path) => {
                        console.log(converted_path);
                        reqreload('./upload.js').upload(post.filepath, (original_url) => {
                            core.bot.channels.get(core.ch.gekkylog).send({ files: [converted_path] }).then(converted => {
                                message.channel.send({
                                    embed: {
                                        "title": "WaifuCloud",
                                        "description": "**Post Link:** " + post.url + "\n**Tags:** " + post.tags,
                                        "image": {
                                            "url": converted.attachments.first().url
                                        },
                                        "url": original_url,
                                        "color": message.member.highestRole.color
                                    }
                                });
                            });
                        });
                    });
                }
            }
        });
    },
    stats: (core, message) => {
        sendCommand(core, {
            name: 'stats',
            job_id: 'teszt6'
        });
        core.waifucloud.waifuEmitter.once('stats', (stat) => {
            if (message != undefined) {
                message.channel.send({
                    embed: {
                        "title": stat.name,
                        "description": `**Version:** *${stat.version}*\n**GitHub:** *${stat.git}*\n\n**Post count:** *${stat.post_count}*\n**File count:** *${stat.filepath_count}*\n**Database Size:** *${stat.size}*\n**db.json's Size:** *${stat.dbsize}*\n**Uptime:** *${stat.uptime}*`,
                        "color": parseInt('7aef34', 16)
                    }
                })
            } else {
                WC('stats:');
                console.log(stat);
            }
        });
    }
};


function sendCommand(core, commandObj) {
    if (core.waifucloud.connection != undefined) {
        core.waifucloud.connection.sendUTF(JSON.stringify(commandObj));
    } else {
        WC("is not connected");
    }
}

function WC(string) {
    return console.log(c.cyan('[WaifuCloud] ') + string);
}
