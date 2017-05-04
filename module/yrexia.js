// yrexia.js
// websocket server for Aixery clients

const c = require('chalk');
const fs = require('fs');
var reqreload = require('./reqreload.js');
var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function (request, response) {
    response.writeHead(404);
    response.end();
});

server.listen(9669, function () {
    console.log(YRpref() + 'Yrexia server listening on port 9669');
});

wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

var path = './data/yrexia/userlist.json';

var connections = [];

module.exports = {
    teszt: (core, txt, to) => {
        var id = isConnected(to);
        if (id != -1) {
            if (txt == '!location') {
                console.log('location-command sent');
                connections[id].sendUTF(commandOBJ('location'));
            } else if (!txt.startsWith('!')) {
                connections[id].sendUTF(messageOBJ(txt));
            }
        } else {
            console.log(`User '${to}' is not connected.`);
        }
    },

    start: (core) => {

        wsServer.on('request', function (request) {
            var username = JSON.parse(request.origin).username;
            originIsAllowed(request.origin, (resp) => {
                if (!resp.allowed) {
                    if (!resp.newuser) {
                        var conn = request.accept('echo-protocol', request.origin);
                        conn.sendUTF('Bad username&key combo');
                        conn.close();
                        console.log(YRpref() + 'Connection(' + username + ') rejected: Bad username@key combo');
                        return;
                    } else {
                        var conn = request.accept('echo-protocol', request.origin);
                        conn.sendUTF('Username in use.');
                        conn.close();
                        console.log(YRpref() + 'Connection(' + username + ') rejected: Username in use.');
                        return;
                    }
                }
                var connection = request.accept('echo-protocol', request.origin);
                broadcast(messageOBJ(username + ' connected'));

                connection.id = generateID();
                connection.username = username;
                connection.key = getKey(username);
                connections.push(connection);
                if (resp.newuser) {
                    connection.sendUTF('Your key is: ' + connection.key);
                }
                if (username == 'holopad') {
                    connection.sendUTF(commandOBJ('getIp'));
                }
                console.log(YRpref() + username + ' connected (ConnectionID: ' + connection.id + ')');
                connection.on('message', function (message) {
                    if (message.type === 'utf8') {
                        parseMessage(message, connection.id, core);
                        //console.log(c.cyan('[WS] ') + message.utf8Data.toString().trim());
                    }
                });

                connection.on('close', function (reasonCode, description) {
                    console.log(YRpref() + connection.username + ' from ' + connection.remoteAddress + ' disconnected.');
                    connections[connection.id] = 'disconnected';
                    broadcast(messageOBJ(connection.username + ' disconnected'));
                });
            })
        });

    }
}

function isConnected(username) {
    var i = 0;
    while (i < connections.length && connections[i].username != username) { i++ };
    if (i >= connections.length) {
        return -1;
    } else {
        return i;
    }
}
function getKey(username) {
    var userlist = JSON.parse(fs.readFileSync(path));
    var i = 0;
    while (i < userlist.length && userlist[i].username != username) { i++ }
    if (i < userlist.length) {
        return userlist[i].key;
    } else {
        console.log('key not found');
        return undefined;
    }
}
function generateID() {
    var i = 0;
    while (i < connections.length) { i++ };
    return i;
}
function originIsAllowed(originstr, callback) {
    var origin = JSON.parse(originstr);
    if (origin.key == 'newuser') {
        if (!addNewUser(origin)) {
            return callback({ 'allowed': false, 'newuser': true });
        } else {
            return callback({ 'allowed': true, 'newuser': true });
        }
    } else {
        var userlist = JSON.parse(fs.readFileSync(path));
        var i = 0;
        while (i < userlist.length && (userlist[i].key != origin.key
            || userlist[i].username != origin.username)
        ) { i++ }
        if (i < userlist.length) {
            return callback({ 'allowed': true, 'newuser': false });
        } else {
            return callback({ 'allowed': false, 'newuser': false });
        }
    }

}
function addNewUser(origin) {
    if (origin.username == 'Yrexia') {
        return false;
    }
    var userlist = JSON.parse(fs.readFileSync(path));
    var i = 0;
    while (i < userlist.length && userlist[i].username != origin.username) {
        i++;
    }
    if (i < userlist.length) {
        return false;
    } else {
        var keys = [];
        for (i in userlist) {
            keys.push(userlist[i].key);
        }
        do {
            var key = generateKey(8);
        } while (keys.indexOf(key) >= 0)
        var user = {
            'username': origin.username,
            'key': key
        }
        userlist.push(user);
        fs.writeFileSync(path, JSON.stringify(userlist));
        return true;
    }
}
function generateKey(length) {
    const chars = ['A', 'I', 'X', 'E', 'R', 'Y', 'P', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    var key = '';
    for (i = 1; i <= length; i++) {
        key += chars[Math.floor(Math.random() * (chars.length))];
    }
    return key;
}
function YRpref() {
    return c.cyan('[YR] ') + reqreload('./getTime.js')('full') + ' ';
}
function parseMessage(message, id, core) {
    var msg = JSON.parse(message.utf8Data.toString().trim());
    if (msg.type == 'message') {
        console.log(YRpref() + `${connections[id].username}[${id}]: ${msg.content}`);
        broadcast(messageOBJ(msg.content, msg.username));
    }
    if (msg.type == 'command') {
        parseCommand(msg, id, core);
    }
    if (msg.type == 'messagev2') {
        var str = '';
        for (i in msg.content) {
            str += msg.content[i] + ' ';
        }
        console.log(YRpref() + `v2 ${connections[id].username}[${id}]: ${str}`);
        broadcast(messagev2OBJ(msg.content, msg.username));
    }
}
function parseCommand(msg, id, core) {
    if (msg.command == 'userlist') {
        var data = 'Online Users: ';
        for (i in connections) {
            if (connections[i] != 'disconnected') {
                data += connections[i].username + '[' + i + '] ';
            }
        }
        connections[id].sendUTF(messageOBJ(data));
    } else if (msg.command.startsWith('setIp') && msg.username == 'holopad') {
        core.holopadip = msg.command.split(' ')[1];
        console.log('Setting holopad-ip: ' + core.holopadip);
    } else if (msg.command == 'ping') {
        connections[id].sendUTF(commandOBJ('pingEnd'));
    } else if (msg.command == 'location') {
        connections[id].sendUTF(commandOBJ('location'));
    }
}
function broadcast(obj) {
    for (i in connections) {
        if (connections[i] != 'disconnected') {
            connections[i].sendUTF(obj);
        }
    }
}
function commandOBJ(data) {
    return JSON.stringify({
        'username': 'Yrexia',
        'type': 'command',
        'command': data
    });
}
function messageOBJ(data, username) {
    if (username == undefined) {
        username = 'Yrexia';
    }
    return JSON.stringify({
        'username': username,
        'content': data.trim(),
        'type': 'message',
    });
}
function messagev2OBJ(data, username) {
    if (username == undefined) {
        username = 'Yrexia';
    }
    return JSON.stringify({
        'username': username,
        'content': data,
        'type': 'messagev2',
    });
}