// updater.js
// checking and updating from github if needed


var updater = {
    resp: {
        'update': false,
        'full': false,
        'core': false,
        'irc': false,
        'data': ''
    },
    handler = githook({
        path: '/webhook',
        secret: 'kutya'
    }),
    isRegistered: false,
    ver: (callback) => {
        lastcomm = exec('git log -n 1');
        lastcomm.stdout.on('data', (data) => {
            var title = data.toString().split('\n')[4].trim();
            return callback(title);
        });
    },

    fullver: (callback) => {
        lastcomm = exec('git log -n 1');
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

    registerUpdate: (callback) => {
        http.createServer((request, result) => {
            updater.handler(request, result, function (error) {
                result.statusCode = 404;
                result.end("It's forbidden to do this!");
            });
        }).listen(4242);

        updater.handler.on('error', (error) => {
            console.log(c.green('[UPDATER] ') + 'ERROR: ' + error.message);
            return callback(updater.resp);
        });

        updater.handler.on('push', (pushData) => {
            var output = execSync('git pull origin master');
            updater.resp.update = true;
            if (output.indexOf('frame.js') >= 0) {
                updater.resp.full = true;
            }
            if (output.indexOf('core.js') >= 0 ||
                output.indexOf('jsconsole.js') >= 0 ||
                output.indexOf('cachemanager.js') >= 0 ||
                output.indexOf('osutrack.js') >= 0 ||
                output.indexOf('waifucloud.js') >= 0) {
                updater.resp.core = true;
            }
            if (output.indexOf('osuirc.js') >= 0) {
                updater.resp.irc = true;
            }
            updater.resp.data = output;

            return callback(updater.resp);
        });
    }
}