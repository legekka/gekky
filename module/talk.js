// talk.js
// talking part, including tsundere mode

var fs = require('fs');
var Math = require('mathjs');

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
module.exports = (bot, globs, message) => {
    tsun = globs.tsun;
    cmdpref = globs.cmdpref;
    var lower = message.content.toLowerCase();
    delete require.cache[require.resolve('./blacklist.js')];
    if (!require('./blacklist.js').isBlacklisted(message)) {
        if (lower == ':dddddd' && message.author.username == bot.user.username) {
            setTimeout(() => {
                message.edit('Nope.');
            }, 1000);
        }
        if (message.author.username != bot.user.username) {
            if (lower == 'ping') {
                message.channel.sendMessage('Pong!');
            }
            if (lower == 'juj') {
                message.channel.sendMessage('lyuly');
            }
            if (lower.startsWith('loli')) {
                message.channel.sendMessage('loliraid');
            }
            if (lower.indexOf(',,') >= 0) {
                message.channel.sendMessage('nemnemnemNEMNEMNEM!!! Nem.');
            }
            if (lower.indexOf('¯\\_(ツ)_/¯') >= 0) {
                message.channel.sendMessage('¯\\_(ツ)_/¯');
            }
            if (tsun) {
                if (lower.indexOf('kurwa') >= 0 || lower.indexOf('kurva') >= 0) {
                    message.channel.sendMessage('Anyád.');
                }
                if (lower.indexOf('minden szar') >= 0) {
                    message.channel.sendMessage('A gmod nem szar.');
                }
                /*if (lower.indexOf('new score by') >=0 && message.channel.name == 'hun-scores'){
                    message.channel.sendMessage('noob');
                    messageConsoleLog(message,true);
                }*/
                if (lower.indexOf('tsun') >= 0 && lower.indexOf('bot') > 0) {
                    message.channel.sendMessage(dg.random(dg.def));
                }
                if (lower.indexOf('xd') >= 0) {
                    message.channel.sendMessage(dg.random(dg.xd));
                }
                if (lower.indexOf('zsolt') >= 0 && message.channel.id == '144787515268661248') {
                    message.channel.sendMessage(dg.random(dg.zsolt));
                }
                if (lower.indexOf('ante') >= 0 && message.channel.id == '144787515268661248') {
                    message.channel.sendMessage(dg.random(dg.ante));
                }
                if (lower.indexOf('nana') >= 0 && message.channel.id == '144787515268661248') {
                    message.channel.sendMessage(dg.random(dg.nana));
                }
                if (lower.indexOf('szabi') >= 0 && message.channel.id == '144787515268661248') {
                    message.channel.sendMessage(dg.random(dg.szabi));
                }
                if (lower.indexOf('márk') >= 0 && message.channel.id == '144787515268661248') {
                    message.channel.sendMessage(dg.random(dg.mark));
                }
                if (lower.indexOf('sono') >= 0 && message.channel.id == '144787515268661248') {
                    message.channel.sendMessage(dg.random(dg.sono));
                }
                if (lower == 'de') {
                    message.channel.sendMessage('Nem!');
                }
                if (lower == 'nem') {
                    message.channel.sendMessage('De!');
                }
                //TODO
                if ((lower.indexOf(bot.user.username) >= 0 || lower.indexOf('momi') >= 0 || lower.indexOf('m0mi') >= 0 || lower.indexOf('mom1') >= 0 || lower.indexOf('m0m1') >= 0 || lower.indexOf(bot.user.id) >= 0) && (lower.indexOf("reggel") < 0 || lower.indexOf("ohio"))) {
                    message.channel.sendMessage(dg.random(dg.emlites));
                }
                if (lower.startsWith('kus')) {
                    message.channel.sendMessage(dg.random(dg.kus));
                }
                /*
                if (lower.indexOf('slaps') >= 0 && lower.indexOf('<@') && message.author.username == 'Ratina') {
                    var elso, masodik;
                    elso = lower.substring(1, 22);
                    message.channel.sendMessage('*' + fullID + ' slaps ' + elso + '*'); 
                }
                */
                if ((lower.indexOf('szia') >= 0 || lower == 'hi')) {
                    message.channel.sendMessage(dg.random(dg.hi));
                }
                if (lower.startsWith('jó éjt')) {
                    message.channel.sendMessage(dg.random(dg.hi));
                }
                if ((lower.indexOf('>.>') >= 0) || (lower.indexOf('<.<') >= 0)) {
                    message.channel.sendMessage(dg.random(dg.eye));
                }
                if (lower.indexOf('jajne') >= 0 || lower.indexOf('jaj ne') >= 0) {
                    message.channel.sendMessage('Jaj, de. :3');
                }
                if (lower.indexOf('osu.ppy.sh/ss') >= 0) {
                    message.channel.sendMessage("noob");
                }
                if (lower.indexOf('ayy') >= 0) {
                    message.channel.sendMessage('Ayy ayy ayy...');
                }/*
                if (lower.startsWith(cmdpref) &&
                    !lower.startsWith(cmdpref + 'news') &&
                    !lower.startsWith(cmdpref + 'sankaku') &&
                    !lower.startsWith(cmdpref + 'help') &&
                    !lower.startsWith(cmdpref + 'touhou') &&
                    !lower.startsWith(cmdpref + 'sanka5') &&
                    !lower.startsWith(cmdpref + 'nhentai') &&
                    !lower.startsWith(cmdpref + 'weather') &&
                    !lower.startsWith(cmdpref + 'response') &&
                    message.author.username != 'legekka') {
                    message.channel.sendMessage(dg.random(dg.proba));
                }*/
            }
        }
    }
}