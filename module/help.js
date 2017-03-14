// help.js
// getting command list

const fs = require('fs');
var path = './module/command.js';

module.exports = {
    list: (callback) => {
        var entrylist = [];
        text = fs.readFileSync(path).toString().split('\n');
        for (i in text) {
            text[i] = text[i].trim();
            if (text[i].startsWith('// !')) {
                entrylist.push({
                    'cmd': text[i].split('|')[0].substr(3),
                    'desc': text[i].split('|')[1]
                });
            }
        }
        return callback(entrylist);
    }
}