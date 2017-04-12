// yrexia.js
// websocket server for Aixery clients

const c = require('chalk');

function WSpref() {
    return c.cyan('[YR] ') + reqreload('./getTime.js')('full') + ' ';
}

module.exports = (core) => {
    var WebSocketServer = require('websocket').server;

    var http = require('http');

    var server = http.createServer(function (request, response) {
        response.writeHead(404);
        response.end();
    });

    server.listen(9669, function () {
        console.log(WSpref() + 'Yrexia server listening on port 9669');
    });

    wsServer = new WebSocketServer({
        httpServer: server,
        autoAcceptConnections: false
    });
    wsServer.on('request', function (request) {
        if (!originIsAllowed(request.origin)) {
            request.reject();
            console.log(WSpref() + 'Connection from origin ' + request.origin + ' rejected.');
            return;
        }

        /////connection;
        connection = request.accept('echo-protocol', request.origin);
        console.log(WSpref() + 'Connection accepted.');

        connection.on('message', function (message) {
            if (message.type === 'utf8') {
                console.log(c.cyan('[WS] ') + message.utf8Data.toString().trim());
            }
        });

        connection.on('close', function (reasonCode, description) {
            console.log(WSpref() + 'legekka from ' + connection.remoteAddress + ' disconnected.');
        });
    });

}



function originIsAllowed(origin) {
    // check origin
}

