// frame.js
// frame of the core.js
// includes updater system

const fs = require('fs');
const c = require('chalk');
var exec = require('child_process').exec;
var reqreload = require('./module/reqreload.js');

var isStarted = false;  // events
var Reloading = false;
var Starting = true;

var token = fs.readFileSync('../profile.txt').toString();

var gekky;  // The child process

var inp = process.openStdin();  // for the child process inputs

var connection;  // for the WS connection
var WSconnected = false;  // is WS client connected 

setupUpdater();

function frame() {
    isStarted = true;
    gekky = exec('node ./core.js --color');
    gekky.stdout.on('data', function (data) {
        log(data.substr(0, data.length - 1));
    });
    gekky.on('exit', (code) => {
        if (code == 4) {
            isStarted = false;
            log(c.red('[Frame]') + ' Gekky has been stopped...');
        }
        if (code == 2) {
            isStarted = false;
            Reloading = true;
            log(c.red('[Frame]') + ' Reloading Gekky...');
        }
        if (code == 3) {
            isStarted = false;
            Reloading = true;
            log(c.red('[Frame]') + ' Fatal error, restarting Gekky...');
        }
    });
}

setInterval(() => {
    if (Starting) {
        Starting = false;
        frame();
    }
    if (Reloading) {
        Reloading = false;
        frame();
    }
}, 1000);

// updater

function setupUpdater() {
    reqreload('./updater.js').registerUpdate((response) => {
        if (response.update) {
            reqreload('./updater.js').fullver((resp) => {
                log(c.green('[UPDATING]') + ' => ' + c.green(resp.ver));
                if (response.full) {
                    log(c.green('[UPDATER] ') + 'frame.js updated, full reload needed.');
                    if (connected) {
                        if (isStarted) {
                            gekky.stdin.write('close');
                        }
                        log(c.red('[Frame]') + ' Reloading frame...');
                        process.exit(2);

                    }
                } else if (response.core) {
                    if (isStarted) {
                        log(c.green('[UPDATER] ') + 'core.js updated, reloading...');
                        gekky.stdin.write('reload');
                    }
                } else if (response.irc) {
                    if (isStarted) {
                        log(c.green('[UPDATER] ') + 'osuirc.js updated, attempting to reload...');
                        gekky.stdin.write('ircreload');
                    }
                } else {
                    gekky.stdin.write('update-frame ' + JSON.stringify(response.data));
                }
            });
        }
    });
}

// stdio //

inp.addListener('data', (d) => {
    executeCommand(d);
})

// managing commands
// common for discord and websocket

function executeCommand(d, WSmode) {
    var cmd = d.toString().toLowerCase().trim();
    if (!cmd.startsWith('!')) {
        if (isStarted) {
            gekky.stdin.write(d);
        } else {
            log(c.red('[Frame]') + ' Gekky is not started...', WSmode);
        }
    } else {
        // frame commands goes here
        if (cmd == '!start') {
            if (!isStarted) {
                log(c.red('[Frame]') + ' Starting gekky...', WSmode);
                Starting = true;
            } else {
                log(c.red('[Frame]') + ' Gekky is already running...', WSmode);
            }
        } else if (cmd == '!isstarted') {
            isStarted = !isStarted;
            log(c.red('[Frame]') + ' isStarted = ' + isStarted, WSmode);
        } else if (cmd == '!close-frame') {
            if (isStarted) {
                gekky.stdin.write('close');
            }
            log(c.red('[Frame]') + ' Stopping frame...', WSmode);
            process.exit(3);
        } else if (cmd == '!reload-frame') {
            if (isStarted) {
                gekky.stdin.write('close');
            }
            log(c.red('[Frame]') + ' Reloading frame...', WSmode);
            process.exit(2);
        }
        else {
            log("[Frame] Undefined command: '" + cmd + "'", WSmode);
        }
    }
}


// sending back console.log if WSmode is true

function log(text, WSmode) {
    if (WSmode == undefined) {
        console.log(text);
        if (WSconnected) {
            connection.sendUTF(text);
        }
    } else if (WSmode == true) {
        console.log(c.cyan('[WS] ') + text);
        connection.sendUTF(text);
    }
}

// websocket server
// for alternative control

function WSpref() {
    return c.cyan('[WS] ') + reqreload('./getTime.js')('full') + ' ';
}

var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function (request, response) {
    response.writeHead(404);
    response.end();
});

server.listen(6969, function () {
    console.log(WSpref() + 'Websocket server is listening on port 6969');
});

wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
    if (origin === token) {
        return true;
    } else {
        return false;
    }
}
wsServer.on('request', function (request) {
    if (!originIsAllowed(request.origin)) {
        request.reject();
        console.log(WSpref() + 'Connection from origin ' + request.origin + ' rejected.');
        return;
    }
    connection = request.accept('echo-protocol', request.origin);
    WSconnected = true;
    console.log(WSpref() + 'Connection accepted.');
    connection.sendUTF('Oy legekka! Having troubles?\nDirect Access mode');

    connection.on('message', function (message) {
        if (message.type === 'utf8') {
            console.log(c.cyan('[WS] ') + message.utf8Data.toString().trim());
            executeCommand(message.utf8Data, true);
        }
    });

    connection.on('close', function (reasonCode, description) {
        console.log(WSpref() + 'legekka from ' + connection.remoteAddress + ' disconnected.');
        WSconnected = false;
    });
});
