// talk.js
// talking part, including tsundere mode

var fs = require('fs');
var Math = require('mathjs');
var reqreload = require('./reqreload.js');

var path = './data/dialogs.txt';
var dg = {
    'def': [], 'hi': [], 'eye': [],
    'xd': [], 'proba': [], 'emlites': [],
    'kus': [], 'zsolt': [], 'nana': [], 'szabi': [], 'ante': [], 'mark': [], 'sono': [],
    'random': function (array) {
        return array[Math.round(Math.random() * array.length) - 1];
    }
};

function loadDialogs() {
    text = fs.readFileSync(path).toString().split('\n');
    for (i in text) {
        switch (text[i].split('	')[0].trim()) {
            case 's_tsun_def': dg.def.push(text[i].split('	')[1].trim());
                break;
            case 's_tsun_hi': dg.hi.push(text[i].split('	')[1].trim());
                break;
            case 's_tsun_eye': dg.eye.push(text[i].split('	')[1].trim());
                break;
            case 's_tsun_xd': dg.xd.push(text[i].split('	')[1].trim());
                break;
            case 's_tsun_proba': dg.proba.push(text[i].split('	')[1].trim());
                break;
            case 's_tsun_emlites': dg.emlites.push(text[i].split('	')[1].trim());
                break;
            case 's_tsun_kus': dg.kus.push(text[i].split('	')[1].trim());
                break;
            case 's_tsun_zsolt': dg.zsolt.push(text[i].split('	')[1].trim());
                break;
            case 's_tsun_nana': dg.nana.push(text[i].split('	')[1].trim());
                break;
            case 's_tsun_ante': dg.ante.push(text[i].split('	')[1].trim());
                break;
            case 's_tsun_szabi': dg.szabi.push(text[i].split('	')[1].trim());
                break;
            case 's_tsun_mark': dg.mark.push(text[i].split('	')[1].trim());
                break;
            case 's_tsun_sono': dg.sono.push(text[i].split('	')[1].trim());
                break;
        }
    }
}

loadDialogs();
module.exports = {
    default: (core, message) => {
        tsun = core.tsun;
        cmdpref = core.cmdpref;
        var lower = message.content.toLowerCase();
        if (lower.indexOf('gekky') >= 0 && message.channel.id != core.ch.gekkylog) {
            reqreload('./channelpicker.js').come(core, message);
        }
        if (!reqreload('./blacklist.js').isBlacklisted(message)) {
            if (lower == ':dddddd' && message.author.username == core.bot.user.username) {
                setTimeout(() => {
                    message.edit('Nope.');
                }, 1000);
            }
            else if (message.author.username != core.bot.user.username) {
                if (lower == 'ping') {
                    message.channel.sendMessage('Pong!');
                }
                else if (lower == 'juj') {
                    message.channel.sendMessage('lyuly');
                }
                else if (lower.indexOf('loli') >= 0) {
                    message.channel.sendMessage('loliraid');
                }
                else if (lower.indexOf(',,') >= 0) {
                    message.channel.sendMessage('nemnemnemNEMNEMNEM!!! Nem.');
                }
                else if (lower.indexOf('¯\\_(ツ)_/¯') >= 0) {
                    message.channel.sendMessage('¯\\_(ツ)_/¯');
                }
                else if (tsun) {
                    if (lower.indexOf('kurwa') >= 0 || lower.indexOf('kurva') >= 0) {
                        message.channel.sendMessage('Anyád.');
                    }
                    else if (lower.indexOf('minden szar') >= 0) {
                        message.channel.sendMessage('A gmod nem szar.');
                    }
                    else if (lower.indexOf('tsun') >= 0 && lower.indexOf('bot') > 0) {
                        message.channel.sendMessage(dg.random(dg.def));
                    }
                    else if (lower.indexOf('xd') >= 0) {
                        message.channel.sendMessage(dg.random(dg.xd));
                    }
                    else if (lower.indexOf('zsolt') >= 0 && message.channel.id == '144787515268661248') {
                        message.channel.sendMessage(dg.random(dg.zsolt));
                    }
                    else if (lower.indexOf('ante') >= 0 && message.channel.id == '144787515268661248') {
                        message.channel.sendMessage(dg.random(dg.ante));
                    }
                    else if (lower.indexOf('nana') >= 0 && message.channel.id == '144787515268661248') {
                        message.channel.sendMessage(dg.random(dg.nana));
                    }
                    else if (lower.indexOf('szabi') >= 0 && message.channel.id == '144787515268661248') {
                        message.channel.sendMessage(dg.random(dg.szabi));
                    }
                    else if (lower.indexOf('márk') >= 0 && message.channel.id == '144787515268661248') {
                        message.channel.sendMessage(dg.random(dg.mark));
                    }
                    else if (lower.indexOf('sono') >= 0 && message.channel.id == '144787515268661248') {
                        message.channel.sendMessage(dg.random(dg.sono));
                    }
                    else if (lower == 'de') {
                        message.channel.sendMessage('Nem!');
                    }
                    else if (lower == 'nem') {
                        message.channel.sendMessage('De!');
                    }
                    //TODO
                    else if ((lower.indexOf(core.bot.user.username) >= 0 || lower.indexOf('momi') >= 0 || lower.indexOf('m0mi') >= 0 || lower.indexOf('mom1') >= 0 || lower.indexOf('m0m1') >= 0 || lower.indexOf(core.bot.user.id) >= 0) && (lower.indexOf("reggel") < 0 || lower.indexOf("ohio"))) {
                        message.channel.sendMessage(dg.random(dg.emlites));
                    }
                    else if (lower.startsWith('kus')) {
                        message.channel.sendMessage(dg.random(dg.kus));
                    }
                    else if ((lower.indexOf('szia') >= 0 || lower == 'hi')) {
                        message.channel.sendMessage(dg.random(dg.hi));
                    }
                    else if (lower.indexOf('jó éjt') >= 0) {
                        message.channel.sendMessage(dg.random(dg.hi));
                    }
                    else if ((lower.indexOf('>.>') >= 0) || (lower.indexOf('<.<') >= 0)) {
                        message.channel.sendMessage(dg.random(dg.eye));
                    }
                    else if (lower.indexOf('jajne') >= 0 || lower.indexOf('jaj ne') >= 0) {
                        message.channel.sendMessage('Jaj, de. :3');
                    }
                    else if (lower.indexOf('osu.ppy.sh/ss') >= 0) {
                        message.channel.sendMessage("noob");
                    }
                    else if (lower.indexOf('ayy') >= 0) {
                        message.channel.sendMessage('Ayy ayy ayy...');
                    } else if (lower.indexOf('nazi') >= 0 || lower.indexOf('náci') >= 0 && lower.indexOf('mod') >= 0) {
                        message.channel.sendMessage('https://legekka.s-ul.eu/fC1ku6D2.jpg');
                    }
                }
            }
        }
    },
    wrongcommand: (message) => {
        message.channel.sendMessage(dg.random(dg.proba));
    }
}