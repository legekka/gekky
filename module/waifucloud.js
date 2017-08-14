// waifucloud.js
// test-brige for waifucloud

var fs = require('fs');
var c = require('chalk');
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
            WC('connected');

            core.waifucloud.connection.on('message', function (message) {
                if (message.type === 'utf8') {
                    WC(message.utf8Data);
                }
            });

            core.waifucloud.connection.on('error', function (error) {
                WC("Connection Error: " + error.toString());
            });

            core.waifucloud.connection.on('close', function () {
                WC('disconnected');
                core.waifucloud.connection = undefined;
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
    teszt: (core) => {
        if (core.waifucloud.connection != undefined) {
            core.waifucloud.connection.sendUTF(JSON.stringify({
                name: 'data_count',
                job_id: 'teszt'
            }))
        } else {
            WC("is not connected");
        }
    },
    teszt2: (core) => {
        if (core.waifucloud.connection != undefined) {
            core.waifucloud.connection.sendUTF(JSON.stringify({
                name: 'add_post',
                job_id: 'teszt2',
                post: JSON.parse(fs.readFileSync('../tesztpost.json').toString())
            }))
        } else {
            WC("is not connected");
        }
    },
    teszt3: (core) => {
        if (core.waifucloud.connection != undefined) {
            core.waifucloud.connection.sendUTF(JSON.stringify({
                name: 'save',
                job_id: 'teszt3',
            }))
        } else {
            WC("is not connected");
        }
    }
};


function WC(string) {
    return console.log(c.cyan('[WaifuCloud] ') + string);
}
