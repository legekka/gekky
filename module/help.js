// help.js
// getting command list

const fs = require('fs');
var path = 'command.js';

module.exports = {
    list: (callback) => {
        var entrylist = [];
        var entry = {
            'cmd': '',
            'desc': ''
        }
        text = fs.readFileSync(path).toString().split('\n');
        for (i in text) {
            text[i] = text[i].trim();
            if (text[i].startsWith('// !')) {
                entry.cmd = text[i].split('|')[0].substr(3);
                entry.desc = text[i].split('|')[1];
                entrylist.push(entry);
            }
        }
        return callback(entrylist);
    }
}