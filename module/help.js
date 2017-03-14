// help.js
// getting command list

const fs = require('fs');
var path = './module/command.js';

module.exports = {
    list: (callback) => {
        var entrylist = [];
        text = fs.readFileSync(path).toString().split('\n');
        var legekka_only = false;
        for (i in text) {
            text[i] = text[i].trim();
            if (text[i] == '// legekka-only commands') {
                legekka_only = true;
            }
            if (text[i].startsWith('// !') && !legekka_only) {
                entrylist.push({
                    'cmd': text[i].split('|')[0].substr(3),
                    'desc': text[i].split('|')[1]
                });
            }
        }
        return callback(entrylist);
    }
}