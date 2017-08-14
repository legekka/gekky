// waifucloud.js
// test-brige for waifucloud

var fs = require('fs');
var c = require('chalk');
var WebSocketClient = require('websocket').client;
var reqreload = require('./reqreload.js');

var username = "gekky";
var password = fs.readFileSync("D:/waifucloud/waifucloud/password.txt").toString().trim();
var serverip = 'ws://localhost:4243/';

module.exports = {
    start: (core) => {
        console.log('teszt');
        core.waifucloud.client = new WebSocketClient();
        core.waifucloud.client.on('connectFailed', function (error) {
            WC('Connect Error: ' + error.toString());
        });

        core.waifucloud.client.on('connect', function (connection) {
            core.waifucloud.connection = connection;
            console.log(core.waifucloud.connection);
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
            });
        });
        console.log(core.waifucloud.client);
        

        core.waifucloud.client.connect(serverip, 'echo-protocol', JSON.stringify({
            "username": username,
            "password": password
        }));
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
    return console.log(c.cyan('[WaifuCloud] ') + string);
}