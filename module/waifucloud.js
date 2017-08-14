// waifucloud.js
// test-brige for waifucloud

var fs = require('fs');
var c = require('chalk');
var WebSocketClient = require('websocket').client;
var reqreload = require('./reqreload.js');

var username = "gekky";
var password = "D:/waifucloud/waifucloud/"
var serverip = 'ws://127.0.0.1:4243/';

module.exports = {
    start: (core) => {
        console.log('teszt');
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
                WC(' disconnected');
            });
        });
        core.waifucloud.client.connect(serverip, 'echo-protocol', JSON.stringify({
            "username": username,
            "password": password
        }));

        return core.waifucloud.client;
    },
    teszt: (core) => {
        if (core.waifucloud.connection != undefined) {
            core.waifucloud.connection.sendUTF8(JSON.stringify({
                name: 'data_count',
                job_id: 'teszt'
            }))
        }
    }
};


function WC(string) {
    return c.magenta('[WaifuCloud] ') + string;
}