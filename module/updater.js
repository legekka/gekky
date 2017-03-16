// updater.js
// checking and updating from github if needed

var exec = require('child_process').exec;
var execSync = require('child_process').execSync;
const githook = require('github-webhook-handler');
var handler = githook({
	path: '/webhook',
	secret: ''
});
const https = require('https');

var resp = {
    'update': false,
    'full': false,
    'core': false,
	'irc': false,
	'data': ''
}

module.exports = {
	isRegistered: false,
    ver: (callback) => {
        lastcomm = exec('git log --name-status HEAD^..HEAD');
        lastcomm.stdout.on('data', (data) => {
            var title = data.toString().split('\n')[4].trim();
            return callback(title);
        });
    },
    fullver: (callback) => {
        lastcomm = exec('git log --name-status HEAD^..HEAD');
        lastcomm.stdout.on('data', (data) => {
            var text = data.toString().split('\n');
            var title = data.toString().split('\n')[4].trim();
            var str = '';
            var i = 5;
            while (i < text.length && text[i] != '') {
                str += text[i].trim() + '\n';
                i++;
            }
            return callback({
                'ver': title,
                'desc': str
            });
        });
	},
	/*
    update: (callback) => {
        statuscheck = exec('git pull origin master');
        statuscheck.stdout.on('data', (data) => {
            text = data.toString();
            resp.update = false;
            if (text.indexOf('up-to-date') < 0) {
                resp.update = true;
                if (text.indexOf('frame.js') >= 0) {
                    resp.full = true;
                }
                if (text.indexOf('core.js') >= 0 ||
                    text.indexOf('console.js') >= 0) {
                    resp.core = true;
                }
                if (text.indexOf('osuirc.js') >= 0) {
                    resp.irc = true;
                }
                resp.data = text;
                if (text.indexOf('Updating') < 0) {
                    return callback(resp);
                } else {
                    return callback({ 'update': false });
                }
            } else {
                return callback(resp);
            }
        });
	},
	*/
	registerUpdate: (callback) => {
		//if (this.isRegistered)
		//	return;

		https.createServer((request, result) => {
			handler(request, result, function (error) {
				result.statusCode = 404;
				result.end("It's forbidden to do this!");
			});
		}).listen(7777);

		handler.on('error', (error) => {
			resp.data = 'ERROR: ' + error.message;
			callback(resp);
		});

		handler.on('push', (pushData) => {
			var output = execSync('git pull origin master');
			resp.update = true;
			if (output.indexOf('frame.js') >= 0) {
				resp.full = true;
			}
			if (output.indexOf('core.js') >= 0 ||
				output.indexOf('console.js') >= 0) {
				resp.core = true;
			}
			if (output.indexOf('osuirc.js') >= 0) {
				resp.irc = true;
			}
			resp.data = output;

			return callback(resp);
		});

		//this.isRegistered = true;
	}
}