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



var clients = {
    connections: [],
    getConn: (id) => {
        var i = 0;
        while (i < clients.connections.length && clients.connections[i].id != id) { i++ }
        if (i < clients.connections.length) {
            return clients.connections[i].connection;
        } else {
            console.log('could not find');
            return undefined;
        }
    },
    getKey: (id) => {
        var i = 0;
        while (clients.connections[i].id != id
            && i < clients.connections.length) { i++ }
        if (i < clients.connections.length) {
            return clients.connections[i].key;
        } else {
            console.log('could not find');
            return undefined;
        }
    },
    getUsername: (id) => {
        var i = 0;
        while (clients.connections[i].id != id
            && i < clients.connections.length) { i++ }
        if (i < clients.connections.length) {
            return clients.connections[i].username;
        } else {
            console.log('could not find');
            return undefined;
        }
    }
};

module.exports = (core) => {

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
            var id = generateID();
            var key = getKey(username);
            var cn = {
                'connection': request.accept('echo-protocol', request.origin),
                'id': id,
                'username': username,
                'key': key
            }
            clients.connections.push(cn);
            if (resp.newuser) {
                clients.getConn(id).sendUTF('Your key is: ' + key);
            }

            console.log(YRpref() + username + ' connected (ConnectionID: ' + id + ')');
            clients.getConn(id).on('message', function (message) {
                if (message.type === 'utf8') {
                    console.log(c.cyan('[WS] ') + message.utf8Data.toString().trim());
                }
            });

            clients.getConn(id).on('close', function (reasonCode, description) {
                console.log(YRpref() + username + ' from ' + clients.getConn(id).remoteAddress + ' disconnected.');

            });
        })
    });

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
    console.log('connections length: ', clients.connections.length);
    while (i < clients.connections.length && clients.connections[i].id == i) { i++ };
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