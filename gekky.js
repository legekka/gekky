/*
	 gekky - v3.0
	Made by legekka
		 2017
*/


// INITIALIZING

const Discord = require('discord.js');
const Math = require('mathjs');
const fs = require('fs');
const c = require('chalk');
const execSync = require('child_process').execSync;
const bot = new Discord.Client();
const weather = require('weather-js');
const http = require('https');


// error logging
process.on('uncaughtException', function (error) {
    console.log(error.stack);
    bot.channels.get(ch.NtoI('gekkylog')).send('<@143399021740818432>').then(() => {
        bot.channels.get(ch.NtoI('gekkylog')).send('```' + error.stack + '```').then(() => {
            exit(3);
        });
    });
    log(error.stack + '\r\n');
});

var motd = '';					// motd
var token = '';					// gekky's token

var blacklist = [];				// blacklist
var channelblacklist = [];		// channel blacklist
var friendlist = [];            // friend list for loggging presences
var reminders = [];             // reminders

var cmdpref = '!';              // command prefix
var tsun = true;				// tsundere mode
var troll = false;				// troll mode

var SankakuPath = '';			// Sankaku's cache folder
var counter = 0;				// sitedownload.vbs' filename counter

var hb = false;					// heartbeat
var msglogged = false;			// is message logged

var botonline = false;			// online
// file paths
var files = {
    'default': '',
    'help': '',
    'channelID': '',
    'dialogs': '',
    'sankakuhelp': '',
    'profile': '',
    'blacklist': '',
    'channelblacklist': '',
    'friends': '',
    'log': '',
    'update': '',
    'workdays': '',
    'reminders': ''
}

var ch = {
    'Name': [],
    'ID': [],
    'current': '',
    'default': '',
    'defaultID': '',
    'NtoI': name => {
        var i = 0;
        while ((name != ch.Name[i]) && (i < ch.Name.length)) {
            i++;
        }
        if (i < ch.Name.length) {
            return ch.ID[i];
        } else {
            consoleLog(c.bgBlue('## ' + name + ' channel does not exist, joining to #' + ch.default));
            ch.current = ch.default;
            return ch.defaultID;
        }
    }
}
// dialogs
var dg = {
    'def': [], 'hi': [], 'eye': [],
    'xd': [], 'proba': [], 'emlites': [],
    'kus': [], 'zsolt': [], 'nana': [], 'szabi': [], 'ante': [], 'mark': [], 'sono': [],
    'random': function (array) {
        return array[Math.round(Math.random() * array.length) - 1];
    }
};

var inp = process.openStdin();	// console opening

function initialize() {
    var input = fs.createReadStream('gekky.ini');
    var text = fs.readFileSync('gekky.ini').toString().split('\n');
    for (i in text) {
        switch (text[i].split('=')[0].trim()) {
            case 'motd': motd = text[i].split('=')[1].trim();
                break;
            case 'default_path': files.default = text[i].split('=')[1].trim();
                break;
        }
    }
    files.help = files.default + 'data/help.txt';
    files.channelID = files.default + 'data/channelID.txt';
    files.dialogs = files.default + 'data/dialogs.txt';
    files.sankakuhelp = files.default + 'data/sankakuhelp.txt';
    SankakuPath = files.default + 'sankakucache/';
    files.profile = files.default + 'data/profile.txt';
    files.blacklist = files.default + 'data/blacklist.txt';
    files.channelblacklist = files.default + 'data/channel_blacklist.txt';
    files.friends = files.default + 'data/friendlist.txt';
    files.log = files.default + 'data/log.txt';
    files.workdays = files.default + 'data/workdays.txt';
    files.reminders = files.default + 'data/reminders.txt';

    files.update = files.default + 'update/';
    // loading channel infos
    input = fs.createReadStream(files.channelID);
    text = fs.readFileSync(files.channelID).toString().split('\n');
    ch.default = text[0].split('	')[0].trim();
    ch.defaultID = text[0].split('	')[1].trim();
    ch.current = ch.default;
    for (i = 0; i < text.length; i++) {
        ch.Name.push(text[i].split('	')[0].trim());
        ch.ID.push(text[i].split('	')[1].trim());
    }

    // loading dialogs
    input = fs.createReadStream(files.dialogs);
    text = fs.readFileSync(files.dialogs).toString().split('\n');
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

    // loading profile details
    input = fs.createReadStream(files.profile);
    text = fs.readFileSync(files.profile).toString().split('\n');
    for (i in text) {
        if ('token' == text[i].split('=')[0].trim()) {
            token = text[i].split('=')[1].trim();
        }
    }

    // loading blacklist
    input = fs.createReadStream(files.blacklist);
    text = fs.readFileSync(files.blacklist).toString().split('\n');
    for (i in text) {
        blacklist.push(text[i]);
    }

    // channel blacklist loading
    input = fs.createReadStream(files.channelblacklist);
    text = fs.readFileSync(files.channelblacklist).toString().split('\n');
    for (i in text) {
        channelblacklist.push(text[i]);
    }

    // loading friendlist
    input = fs.createReadStream(files.friends);
    text = fs.readFileSync(files.friends).toString().split('\n');
    for (i in text) {
        friendlist.push(text[i].trim());
    }

    // loading reminders
    reloadReminders();
    // generating workday reminders
    generateReminders();
    // new code update listener
    updateListener();
    // daily reloader
    dailyReloader();
    // reminder listener
    reminderStart();
}

// function is_a_prime

function is_a_prime(number) {
    var sqrtnumber = Math.floor(Math.sqrt(number));
    i = 2;
    while (number % i != 0 && i < sqrtnumber) { i++ }
    if (i < sqrtnumber) {
        return false;
    } else {
        return true;
    }
}


// secret function
var array = [];

function checkSecret(list,callback) {
    console.log('response');
    var szamok = list.split(' ');
    console.log(szamok);
    var megold = 0;
    for (i in szamok) {
        j=0;
        while (j<array.length && szamok[i]!=array[j]) {j++}
        if (j<array.length) {
            megold++;
        }
    }
    if (megold == array.length) {
        return callback('sikeres megoldás');
    } else {
        return callback('helytelen megoldás');
    }
}

function giveSecret(count,max,callback) {
    array = [];
    var number;
    for (var i = 1; i <= count; i++) {
        do {
            number = Math.randomInt(max);
        }
        while (!is_a_prime(number) && array.indexOf(number) < 0);
        console.log(number);
        array.push(number);
    }
    console.log(array);
    var mult = 1;
    for (i in array) {
        mult = mult * array[i];
    }
    return callback(mult);
}


// reminderLister 

function reminderLister(mode, callback) {
    var da = new Date();
    var desc = '';
    if (mode == 'daily') {
        for (i in reminders) {
            if (reminders[i].ev == da.getFullYear() && reminders[i].ho == (da.getMonth() + 1) && reminders[i].nap == da.getDate() && parseInt(reminders[i].ora) * 60 + parseInt(reminders[i].perc) > da.getHours() * 60 + da.getMinutes()) {
                desc += "**" + reminders[i].ora + ":" + reminders[i].perc + "** " + reminders[i].text + "\n";
            }
        }
        if (desc == '') {
            return callback({
                "title": "A mai nap nincsenek emlékeztetőid"
            });
        } else {
            return callback({
                "title": "A mai napi hátralévő emlékeztetőid",
                "description": desc
            });
        }
    } else if (mode == "next") {
        i = 0;
        while (i < reminders.length && reminders[i].ev == da.getFullYear() && reminders[i].ho == (da.getMonth() + 1) && reminders[i].nap == da.getDate() && parseInt(reminders[i].ora) * 60 + parseInt(reminders[i].perc) >= da.getHours() * 60 + da.getMinutes()) { i++ }
        if (i < reminders.length) {
            return callback({
                "title": "TODO!",
                "description": "**" + reminders[i].ev + "." + reminders[i].ho + "." + reminders[i].nap + " " + reminders[i].ora + ":" + reminders[i].perc + "** " + reminders[i].text
            });
        } else {
            return callback({
                "title": "TODO"
            });
        }
    } else {
        for (i in reminders) {
            desc += "**" + reminders[i].ev + "." + reminders[i].ho + "." + reminders[i].nap + " " + reminders[i].ora + ":" + reminders[i].perc + "** " + reminders[i].text + "\n";
        }
        if (desc == '') {
            return callback({
                "title": "Nincsenek emlékeztetőid."
            });
        } else {
            return callback({
                "title": "Az összes emlékeztetőd",
                "description": desc
            });
        }
    }
}


// reminder function



function reloadReminders() {
    input = fs.createReadStream(files.reminders);
    text = fs.readFileSync(files.reminders).toString().split('\n');
    reminders = [];
    for (i in text) {
        reminders.push({
            "ev": text[i].split(',')[0].split('.')[0],
            "ho": text[i].split(',')[0].split('.')[1],
            "nap": text[i].split(',')[0].split('.')[2],
            "ora": text[i].split(',')[0].split('.')[3],
            "perc": text[i].split(',')[0].split('.')[4],
            "text": text[i].split(',')[1],
            "armed": true
        });
    }

}

function reminderStart() {
    setInterval(() => {
        var da = new Date();
        for (i in reminders) {
            if (da.getFullYear() == reminders[i].ev && (da.getMonth() + 1) == reminders[i].ho && da.getDate() == reminders[i].nap && da.getHours() == reminders[i].ora && da.getMinutes() == reminders[i].perc && reminders[i].armed == true) {
                reminders[i].armed = false;
                bot.channels.get(ch.defaultID).send("<@143399021740818432> **" + reminders[i].text + "**\n" + reminders[i].ora + ':' + reminders[i].perc);
            }
        }
    }, 1000);
}






// workdayinfo napora atvaltas

function napora(a, b) {
    if (b - a < 0) {
        return b - a + 24;
    } else {
        return b - a;
    }
}

// workdayinfo

function workdayinfo(callback) {
    var da = new Date();
    input = fs.createReadStream(files.workdays);
    text = fs.readFileSync(files.workdays).toString().split('\n');
    var kezd;
    var bef;
    var szabad = false;
    var megvan = false;
    for (i in text) {
        var datum = text[i].split(',')[0].trim();
        var dadatum = da.getFullYear() + '.' + (da.getMonth() + 1) + '.' + da.getDate();
        if (dadatum == datum) {
            megvan = true;
            if (text[i].split(',')[1] == "free") {
                szabad = true;
            } else {
                kezd = parseInt(text[i].split(',')[1].split('-')[0]);
                bef = parseInt(text[i].split(',')[1].split('-')[1]);
            }
        }
    }
    var str = '';
    var color = "505050";
    if (megvan) {
        if (szabad) {
            str = "Ma nem dolgozol, remélem örülsz.\nÉn nem.";
            color = "9cff01";
        } else {
            str = "Ma " + kezd + " órától " + bef + " óráig dolgozol.\n"
            if (napora(kezd, bef) <= 6) {
                str += "Egy rövidke " + napora(kezd, bef) + " órácskás műszak.";
                color = "01ff07";
            } else if (napora(kezd, bef) <= 8) {
                str += "Normál " + napora(kezd, bef) + " órás műszak.";
                color = "f6ff00";
            } else {
                str += napora(kezd, bef) + " óra??? Te beteg vagy. Kitartást.";
                color = "ff0000";
            }

            var ind = kezd - 2;
            var hatra_perc;
            var hatra_ora;
            if (29 - da.getMinutes() < 0) {
                hatra_perc = 29 - da.getMinutes() + 60;
                hatra_ora = -1;
            } else {
                hatra_perc = 29 - da.getMinutes();
                hatra_ora = 0;
            }
            if (ind - da.getHours() < 0) {
                hatra_ora += ind - da.getHours() + 24;
            } else {
                hatra_ora += ind - da.getHours();
            }
            if (hatra_ora > 0) {
                str += "\nIndulásig még van hátra **" + hatra_ora + " óra " + hatra_perc + "perc**ed.";
            } else {
                str += "\nIndulásig már csak **" + hatra_perc + "perc**ed van hátra."
            }
        }
    } else {
        str = "A mai napra nincs infóm a munkaidőddel kapcsolatban.\nRemélem neked azért van."
    }
    return callback({
        "title": "Munkanap Info",
        "description": str,
        "color": parseInt(color, 16)
    });
}

// generate workday reminders

function generateReminders() {
    input = fs.createReadStream(files.workdays);
    text = fs.readFileSync(files.workdays).toString().split('\n');
    for (i in text) {
        if (text[i].split(',')[1] != 'free') {
            var ora = parseInt(text[i].split(',')[1].split('-')[0]) - 2;
            var perc1 = 19;
            var perc2 = 29;
            reminders.push({
                "ev": text[i].split(',')[0].split('.')[0],
                "ho": text[i].split(',')[0].split('.')[1],
                "nap": text[i].split(',')[0].split('.')[2],
                "ora": ora,
                "perc": perc1,
                "text": "10 perc az indulásig, lassan kezdhetsz készülődni.",
                "armed": true
            });
            reminders.push({
                "ev": text[i].split(',')[0].split('.')[0],
                "ho": text[i].split(',')[0].split('.')[1],
                "nap": text[i].split(',')[0].split('.')[2],
                "ora": ora,
                "perc": perc2,
                "text": "Indulás munkába!",
                "armed": true
            });
        }
    }
}

// weatherinfo

function weatherInfo(city, callback) {
    weather.find({ search: city, degreeType: 'C' }, function (err, result) {
        if (err) { console.log(err); }
        var desc = "Temperature: " + result[0].current.temperature + " °C" +
            "\nSky: " + result[0].current.skytext +
            "\nHumidity: " + result[0].current.humidity + " %" +
            "\nWind Speed: " + result[0].current.windspeed +
            "\nObservation Time: " + result[0].current.observationtime;
        return callback({
            "title": "Weather: " + result[0].location.name,
            "description": desc,
            "thumbnail": {
                "url": result[0].current.imageUrl
            }
        });
    });
}


// assistant mode

function ohio(message) {
    var da = new Date();
    var str = '';
    if (da.getHours() < 12) {
        if (da.getHours() <= 6) {
            str = "Miért keltél ilyen korán O_o";
        } else {
            str = "Remélem jól aludtál...";
        }
    } else {
        if (da.getHours() >= 18) {
            str = "Kúrálod a másnaposságod?";
        } else {
            str = "Hétalvó...";
        }
    }
    message.channel.send("**Ohio legekka!**\n*" + str + "*\n\nTessék, itt van pár infó, hogy jól kezdd a napod:");
    weatherInfo("Budapest", (response) => {
        message.channel.send({embed:response});
    });
    workdayinfo((response) => {
        message.channel.send({embed:response});
    });
}


// daily reloader
function dailyReloader() {
    var da = new Date();
    var day = da.getDate();
    setInterval(() => {
        var currdate = new Date();
        var currday = currdate.getDate();
        if (day != currday) {
            bot.channels.get(ch.defaultID).send('[daily reload]');
            consoleLog('[daily reload]');
            exit(3);
        }
    }, 3600000);
}

// update listener 

function updateListener() {
    setInterval(() => {
        if (fs.existsSync(files.update + 'new.txt')) {
            consoleLog('[new update available]');
            code = execSync('rm -f ' + files.update + 'new.txt');
            exit(4);
        }
    }, 1000);
}

// append line to the log file

function consoleLog(text) {
    console.log(text);
    if (botonline) {
        bot.channels.get(ch.NtoI('gekkylog')).send(text.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, ''));
    }
    log(text + '\r\n');
}

function log(text) {
    var rawtext = text.replace(
        /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
    if (rawtext.indexOf('gekkylog') < 0) {
        fs.appendFile(files.log, rawtext);
    }
}


// is_a_friend
function is_a_friend(userid) {
    i = 0;
    while (i < friendlist.length && userid != friendlist[i]) {
        i++;
    }

    if (i < friendlist.length) {
        return true;
    } else {
        return false;
    }
}

// getting formatted time

function getTime(format) {
    var da = new Date();
    switch (format) {
        case 'time': return da.getHours() + ':' + da.getMinutes() + ':' + da.getSeconds();
            break;
        case 'date': return da.getFullYear() + '-' + (da.getMonth() + 1) + '-' + da.getDate();
            break;
        case 'full': return da.getFullYear() + '-' + (da.getMonth() + 1) + '-' + da.getDate() + ' ' + da.getHours() + ':' + da.getMinutes() + ':' + da.getSeconds();
            break;
        default: return '<####>';
            break;
    }
}

// console name colors function
function usercolor(user) {
    switch (user.username) {
        case 'Nesze': return c.bgYellow.magenta(user.username);
            break;
        case 'legekka': return c.bgWhite.blue(user.username);
            break;
        case bot.user.username: return c.bgWhite.green(user.username);
        default:
            if (is_a_friend(user.id)) {
                return c.green(user.username);
            } else {
                return c.cyan(user.username);
            }
            break;
    }
}

// status colors

function statuscolor(status, char, mode) {
    if (mode == 0) {
        switch (status) {
            case 'online':
                return c.green(char);
                break;
            case 'offline':
                return c.grey(char);
                break;
            case 'idle':
                return c.yellow(char);
                break;
            case 'dnd':
                return c.red(char);
                break;
            default:
                return status;
                break;
        }
    } else {
        return char + status + ' ';
    }

}

// console message log

function messageConsoleLog(message, is_a_command) {
    if (!msglogged) {
        var chname = message.channel.name;
        if (chname == undefined) { chname = 'private#' }
        if (message.content == '') { message.content = '<attachment>'; }
        if (ch.current == chname) {
            consoleLog(getTime('full') + c.yellow(' #' + chname) + ' ' + usercolor(message.author) + ': ' + c.grey(message.content));
        } else {
            if (is_a_command) {
                consoleLog(c.gray(getTime('full') + ' #' + chname + ' ' + message.author.username + ': ' + message.content));
            }
            if (!is_a_command) {
                log(getTime('full') + ' #' + chname + ' ' + message.author.username + ': ' + message.content + '\r\n');
            }
        }
    }
    msglogged = true;
}

// exit/reload function

function exit(code) {
    switch (code) {
        case 2:
            bot.channels.get(ch.defaultID).send('[closing]').then(() => { bot.destroy(); });
            log('[closing]\r\n');
            setTimeout(function () { process.exit(code); }, 2000);
            break;
        case 3:
            bot.channels.get(ch.defaultID).send('[reloading]').then(() => { bot.destroy(); });
            log('[reloading]\r\n');
            setTimeout(function () { process.exit(code); }, 2000);
            break;
        case 4:
            bot.channels.get(ch.defaultID).send('[updating]').then(() => { bot.destroy(); });
            log('[updating]\r\n');
            setTimeout(function () { process.exit(3); }, 2000);
            break;
        default:
            bot.channels.get(ch.defaultID).send('[exiting with code:' + code + ']').then(() => { bot.destroy(); });
            log('[exiting with code:' + code + ']\r\n');
            setTimeout(function () { process.exit(code); }, 2000);
            break;
    }
}


// file sender function

function sendFile(message, filename) {
    if (fs.existsSync(filename)) {
        //bot.sendFile(message, filename);
        message.channel.send({files:[filename]});
    } else {
        message.channel.send('Nincs ilyen fájl: ' + filename);
    }
}
// sankakupath-->cmd

function cmdmode(name) {
    while (name != name.replace('\\\\', '\\')) {
        name = name.replace('\\\\', '\\');
    }
    return name;
}

// checking cache size

function checkCache(path, limit, message) {
    var code = execSync('du -s ' + path + ' > ' + files.default + 'cachesize.txt');
    var input = fs.createReadStream('cachesize.txt');
    var text = fs.readFileSync('cachesize.txt').toString().trim().split()[0];
    var size = Math.round(parseInt(text) / 1024, 3);
    if (size > limit) {
        if (message != undefined) {
            message.channel.send('Cache size is over the limit. ' + size + ' MB / ' + limit + ' MB');
        }
        //consoleLog('Cache size is over the limit. ' + size + ' MB / ' + limit + ' MB');
    } else {
        if (message != undefined) {
            message.channel.send('Cache size is under the limit. ' + size + ' MB / ' + limit + ' MB');
        }
        //consoleLog('Cache size is under the limit. '+ size + ' MB / ' + limit + ' MB');
    }
}

// https get file
var done = false;

function httpGet(url, filename) {
    var downloadedfile = fs.createWriteStream(SankakuPath + filename);
    done = false;
    var request = http.get(url, function (response) {
        response.pipe(downloadedfile, { end: false });
        response.on('end', () => {
            done = true;
        });
    });
}

// doujin search on nhentai

function nhentaiSearch(message, searchword) {
    bot.user.setGame('<nhentai>');
    var ncounter = message.id;
    var url_link = 'https://nhentai.net/search/?q=';
    while (searchword != searchword.replace(' ', '+')) {
        searchword = searchword.replace(' ', '+');
    }
    while (searchword != searchword.replace('_', '-')) {
        searchword = searchword.replace('_', '-');
    }
    while (searchword != searchword.replace('?', '%3F')) {
        searchword = searchword.replace('?', '%3F');
    }
    url_link = url_link + searchword;
    httpGet(url_link, ncounter + '.html');
    var inta = setInterval(() => {
        if (done) {
            clearInterval(inta);
            if (fs.existsSync(SankakuPath + ncounter + '.html')) {
                var input = fs.createReadStream(SankakuPath + ncounter + '.html');
                var array = fs.readFileSync(SankakuPath + ncounter + '.html').toString().split('\n');
                var no_match = false;
                var word = '';
                var i = 0;
                while (i < array.length && array[i].indexOf('404 – Not Found') < 0) { i++; }
                if (i < array.length) { no_match = true; }
                if (!no_match) {
                    var result_count;
                    var i = 0;
                    while (i < array.length && array[i].indexOf('Results') < 0) { i++; }
                    if (i < array.length) {
                        var word = array[i].trim().substr(4, array[i].trim().indexOf(' Result') - 4);
                        while (word != word.replace(',', '')) {
                            word = word.replace(',', '');
                        }
                        result_count = parseInt(word);
                        if (Math.ceil(result_count / 25) > 400) {
                            var page = Math.round(Math.random() * Math.ceil(400) - 1) + 1;
                        } else if (result_count <= 25) {
                            var page = 1;
                        } else {
                            var page = Math.round(Math.random() * Math.ceil(result_count / 25) - 1) + 1;
                        }
                        ncounter += 'b';
                        httpGet(url_link + '&page=' + page, ncounter + '.html');
                        var inte = setInterval(() => {
                            if (done) {
                                clearInterval(inte);
                                var doujinlist = [];
                                var input = fs.createReadStream(SankakuPath + ncounter + '.html');
                                var array = fs.readFileSync(SankakuPath + ncounter + '.html').toString().split('\n');
                                for (i in array) {
                                    if (array[i].indexOf('<div class="gallery" data-tags=') >= 0) {
                                        var word = array[i].trim().substr(array[i].trim().indexOf('<a href="') + 9);
                                        word = 'https://nhentai.net' + word.substr(0, word.indexOf('"'));
                                        doujinlist.push(word);
                                    }
                                }
                                var rnumber = Math.round((Math.random() * (doujinlist.length - 1) + 1));
                                if (doujinlist[rnumber] != undefined) {
                                    message.channel.send(doujinlist[rnumber]);
                                    consoleLog(doujinlist[rnumber]);
                                } else {
                                    message.channel.send('Nincs találat. ¯\\_(ツ)_/¯');
                                    consoleLog('Nincs találat. ¯\\_(ツ)_/¯');
                                }
                            }
                        }, 100);
                    }
                } else {
                    message.channel.send('Nincs találat. ¯\\_(ツ)_/¯');
                    consoleLog('Nincs találat. ¯\\_(ツ)_/¯');
                }
            } else {
                message.channel.send('Nincs találat. ¯\\_(ツ)_/¯');
                consoleLog('Nincs találat. ¯\\_(ツ)_/¯');
            }
        }
    }, 100);



    bot.user.setGame(motd);


}

// embed message color by rating

function ratingColor(rating) {
    switch (rating) {
        case 'safe':
            return parseInt('7aef34', 16);
            break;
        case 'explicit':
            return parseInt('fa2525', 16);
            break;
        case 'questionable':
            return parseInt('f4ee3d', 16);
            break;
        default:
            return parseInt('ff761d', 16);
            break;
    }
}

// send sankaku help

function sendHelp(message) {
    var input = fs.createReadStream(files.sankakuhelp);
    var array = fs.readFileSync(files.sankakuhelp).toString();
    //message.channel.send('```'+array+'```');
    message.channel.send({embed:{
        "title": "Sankaku Help",
        "description": '```' + array + '```',
        "color": parseInt('ff761d', 16)
    }});
}

// image search on sankaku

function sankakuSearch(message, searchword, mode) {
    //bot.user.setStatus('online');
    bot.user.setGame('<sankaku>');
    url_link = 'https://chan.sankakucomplex.com/?tags=';
    while (searchword != searchword.replace(' ', '+')) {
        searchword = searchword.replace(' ', '+');
    }
    url_link = url_link + searchword;
    // getting result_count
    var result_count;
    var word = '';
    process.stdout.write('Sankaku search');
    counter++;
    code = execSync('curl -s "' + url_link + '" > ' + SankakuPath + counter + '.html');
    var timed_out = false;
    if (fs.existsSync(SankakuPath + counter + '.html')) {
        var input = fs.createReadStream(SankakuPath + counter + '.html');
        var array = fs.readFileSync(SankakuPath + counter + '.html').toString().split('\n');
        var no_match = false;
        var is_private = false;
        var no_user = false;
        for (i in array) {
            if (array[i].trim().indexOf('Post Count: ') >= 0) {
                var word = array[i].trim().substr(array[i].trim().indexOf('</h2>') - 25).substr(array[i].trim().substr(array[i].trim().indexOf('</h2>') - 25).indexOf('>') + 1, array[i].trim().substr(array[i].trim().indexOf('</h2>') - 25).indexOf('<') - array[i].trim().substr(array[i].trim().indexOf('</h2>') - 25).indexOf('>') - 1);
                while (word != word.replace(',', '')) {
                    word = word.replace(',', '');
                }
                result_count = parseInt(word);
            }
            if (array[i].trim().indexOf('No matching posts') >= 0) {
                no_match = true;
            }
            if (array[i].trim().indexOf("are private") >= 0) {
                is_private = true;
            }
            if (array[i].trim().indexOf("No such user") >= 0) {
                no_user = true;
            }
        }
    } else {
        timed_out = true;
    }
    if (result_count != 0 && !no_match && !is_private && !no_user && !timed_out) {
        // getting pages and generating a random one
        var page = 1;
        if (mode == 0) {
            if (result_count != undefined) {
                if (Math.ceil(result_count / 20) > 25) {
                    page = Math.round(Math.random() * 25 - 1) + 1;
                } else {
                    page = Math.round(Math.random() * Math.ceil(result_count / 20) - 1) + 1;
                }
            }
        }
        if (mode != 2) {
            // getting images from the random page
            process.stdout.write('.');
            counter++;
            code = execSync('curl -s "' + url_link + '&page=' + page + '" > ' + SankakuPath + counter + '.html');
            var imagelist = [];
            var previewlist = [];
            var input = fs.createReadStream(SankakuPath + counter + '.html');
            var array = fs.readFileSync(SankakuPath + counter + '.html').toString().split('\n');
            for (i in array) {
                if (array[i].trim().startsWith('<span class="thumb" id=')) {
                    word = '';
                    for (j = 0; j < 7; j++) {
                        if (!isNaN(parseInt(array[i].trim().substr(25, 7)[j]))) {
                            word += array[i].trim().substr(25, 7)[j];
                        }
                    }
                    imagelist.push(word);
                    word = array[i].trim();
                    word = word.substr(word.indexOf('//c.'));
                    word = "https:" + word.substr(0, word.indexOf('"'));
                    previewlist.push(word);
                } else if (array[i].trim().startsWith('<span class="thumb blacklisted" id=')) {

                    var word = '';
                    for (j = 0; j < 7; j++) {
                        if (!isNaN(parseInt(array[i].trim().substr(36, 7)[j]))) {
                            word += array[i].trim().substr(36, 7)[j];
                        }
                    }
                    imagelist.push(word);
                    word = array[i].trim();
                    word = word.substr(word.indexOf('//c.'));
                    word = "https:" + word.substr(0, word.indexOf('"'));
                    previewlist.push(word);
                }
            }
        }
        if (mode == 0) {
            var rnumber = Math.round((Math.random() * (imagelist.length - 1) + 1));
            url_link = 'https://chan.sankakucomplex.com/post/show/' + imagelist[rnumber];
            counter++;
            code = execSync('curl -s "' + url_link + '" > ' + SankakuPath + counter + '.html');
            var input = fs.createReadStream(SankakuPath + counter + '.html');
            var array = fs.readFileSync(SankakuPath + counter + '.html').toString().split('\n');
            var original_url = '';
            var resized_url = '';
            var rating = '';
            var ind = -1;
            for (i = 0; i < array.length; i++) {
                if (array[i].indexOf("<li>Rating: ") >= 0) {
                    ind = i;
                }
            }
            if (ind != -1) {
                rating = array[ind].substr(array[ind].indexOf(' '));
                rating = rating.substr(0, rating.indexOf('<')).trim().toLowerCase();
            } else {
                consoleLog("FUCK.");
            }
            var i = 0;
            while (i < array.length && array[i].indexOf("Original:") < 0) { i++ }
            if (i < array.length) {
                original_url = array[i].trim().substr(array[i].indexOf('/'));
                original_url = "https:" + original_url.substr(0, original_url.indexOf('?'));
            } else {
                consoleLog("Kurwa2.");
            }
            var i = 0;
            while (i < array.length && array[i].indexOf("Resized:") < 0) { i++ }
            if (i < array.length) {
                resized_url = array[i].trim().substr(array[i].indexOf('/'));
                resized_url = "https:" + resized_url.substr(0, resized_url.indexOf('?'));
                process.stdout.write('.');
            } else {
                process.stdout.write('O');
                resized_url = original_url;
            }
            var ext = resized_url.substr(resized_url.length - 3, 3);
            counter++;
            code = execSync('curl -s "' + resized_url + '" > ' + SankakuPath + counter + '.' + ext);

            bot.channels.get(ch.NtoI('gekkylog')).send({files:[SankakuPath + counter + "." + ext]}).then((response) => {
                message.channel.send({embed:{
                    "title": "Full size",
                    "description": "Post ID: " + imagelist[rnumber] + "\nPost link: " + url_link,
                    "color": ratingColor(rating),
                    "image": response.attachments.first(),
                    "url": original_url
                }});
            });
            process.stdout.write('.\n');
        }
        if (mode == 1) {
            /*if (imagelist.length > 5) {
				var n = 5;
			} else {
				var n = imagelist.length;
			}
			var original_url = [];
			var resized_url = [];
			var ext = [];
			process.stdout.write('[');
			for (j=0; j<n; j++) {
				url_link = 'https://chan.sankakucomplex.com/post/show/' + imagelist[j];
				counter++;
				code = execSync('curl -s "' + url_link + '" > ' + SankakuPath + counter + '.html');
				var input = fs.createReadStream(SankakuPath + counter + '.html');
				var array = fs.readFileSync(SankakuPath + counter + '.html').toString().split('\n');
				if (fs.existsSync(SankakuPath + counter + '.html')) {
					for (i in array){
						var i = 0;
						while (i<array.length && array[i].indexOf("Original:") < 0) {i++}
						if (i<array.length) {
							original_url[j] = array[i].trim().substr(array[i].indexOf('/'));
							original_url[j] = "https:" + original_url[j].substr(0,original_url.indexOf('?'));
						} else {
							consoleLog("Kurwa2.");
						}
						var i = 0;
						while (i<array.length && array[i].indexOf("Resized:") <0) {i++}
						if (i<array.length) {
							resized_url[j] = array[i].trim().substr(array[i].indexOf('/'));
							resized_url[j] = "https:" + resized_url[j].substr(0,resized_url.indexOf('?'));
							process.stdout.write('.');
						} else {
							process.stdout.write('O');
							resized_url[j] = original_url[j];
						}
						ext[j] = resized_url[j].substr(resized_url[j].length-3,3);
						
						counter++;
						code = execSync('curl -s "' + resized_url[j] + '" > ' + SankakuPath + counter + '.' + ext[j]);
						bot.channels.get(ch.NtoI('gekkylog')).sendFile(SankakuPath + counter + "." + ext[j], undefined, imagelist[j] + '|' + original_url[j]).then( (response) => {
							var ipost = response.attachments.first().message.content.split('|')[0];
							var orurl = response.attachments.first().message.content.split('|')[1];
							message.channel.send({embed:{
								"title" : "Full size",
								"description" : "Post ID: " + ipost + "\nPost link: https://chan.sankakucomplex.com/post/show/" + ipost,
								"color" : parseInt('ff761d',16),
								"image" : response.attachments.first(),
								"url" : orurl
							}});
						});
					}
				}
			}*/
        }

        if (mode == 2) {
            var imagepost = [];
            var charactername = [];
            var original_url = [];
            var resized_url = [];
            var ext = [];
            process.stdout.write('[');
            for (j = 0; j < 5; j++) {
                if (Math.ceil(result_count / 20) > 25) {
                    page = Math.round(Math.random() * 25 - 1) + 1;
                } else {
                    page = Math.round(Math.random() * Math.ceil(result_count / 20) - 1) + 1;
                }
                url_link = 'https://chan.sankakucomplex.com/?tags=' + searchword;
                counter++;
                code = execSync('curl -s "' + url_link + '&page=' + page + '" > ' + SankakuPath + counter + '.html');
                var imagelist = [];
                var input = fs.createReadStream(SankakuPath + counter + '.html');
                var array = fs.readFileSync(SankakuPath + counter + '.html').toString().split('\n');
                for (i in array) {
                    if (array[i].trim().startsWith('<span class="thumb" id=')) {
                        var word = '';
                        for (k = 0; k < 7; k++) {
                            if (!isNaN(parseInt(array[i].trim().substr(25, 7)[k]))) {
                                word += array[i].trim().substr(25, 7)[k];
                            }
                        }
                        imagelist.push(word);
                    } else if (array[i].trim().startsWith('<span class="thumb blacklisted" id=')) {
                        var word = '';
                        for (k = 0; k < 7; k++) {
                            if (!isNaN(parseInt(array[i].trim().substr(36, 7)[k]))) {
                                word += array[i].trim().substr(36, 7)[k];
                            }
                        }
                        imagelist.push(word);
                    }
                }
                var rnumber = Math.round((Math.random() * (imagelist.length - 1) + 1));
                imagepost[j] = (imagelist[rnumber]);
                url_link = 'https://chan.sankakucomplex.com/post/show/' + imagelist[rnumber];
                counter++;
                code = execSync('curl -s "' + url_link + '" > ' + SankakuPath + counter + '.html');
                var input = fs.createReadStream(SankakuPath + counter + '.html');
                var array = fs.readFileSync(SankakuPath + counter + '.html').toString().split('\n');
                if (fs.existsSync(SankakuPath + counter + '.html')) {
                    var i = 0;
                    while (array[i].trim().indexOf('<li class=tag-type-character><a href="/?tags=') < 0) { i++ }
                    if (i < array.length) {
                        var startchar = array[i].trim().indexOf('<li class=tag-type-character><a href="/?tags=') + 45;
                        var word = array[i].trim().substr(startchar);
                        charactername[j] = word.substr(0, word.indexOf('"'));
                    }
                    var i = 0;
                    while (i < array.length && array[i].indexOf("Original:") < 0) { i++ }
                    if (i < array.length) {
                        original_url[j] = (array[i].trim().substr(array[i].indexOf('/')));
                        original_url[j] = "https:" + original_url[j].substr(0, original_url[j].indexOf('?'));
                    } else {
                        consoleLog("Kurwa2.");
                    }
                    var i = 0;
                    while (i < array.length && array[i].indexOf("Resized:") < 0) { i++ }
                    if (i < array.length) {
                        resized_url[j] = (array[i].trim().substr(array[i].indexOf('/')));
                        resized_url[j] = "https:" + resized_url[j].substr(0, resized_url[j].indexOf('?'));
                        process.stdout.write('.');
                    } else {
                        process.stdout.write('O');
                        resized_url[j] = original_url[j];
                    }
                    ext[j] = resized_url[j].substr(resized_url[j].length - 3, 3);
                    counter++;
                    code = execSync('curl -s "' + resized_url[j] + '" > ' + SankakuPath + counter + '.' + ext[j]);
                    bot.channels.get(ch.NtoI('gekkylog')).send({files:[SankakuPath + counter + "." + ext[j], undefined, charactername[j] + '|' + imagepost[j] + '|' + original_url[j]]}).then((response) => {
                        var cname = response.attachments.first().message.content.split('|')[0];
                        var ipost = response.attachments.first().message.content.split('|')[1];
                        var orurl = response.attachments.first().message.content.split('|')[2];
                        message.channel.send({embed:{
                            "title": nameify(cname),
                            "description": "Post ID: " + ipost + "\nPost link: https://chan.sankakucomplex.com/post/show/" + ipost,
                            "color": parseInt('ff761d', 16),
                            "image": response.attachments.first(),
                            "url": orurl
                        }});
                    });
                } else {
                    j = j - 1;
                }
            }
            process.stdout.write(']\n');
        }
    } else {
        process.stdout.write('\n');
        var local_msg = 'Nincs találat.';
        if (is_private) { local_msg = local_msg + ' Privát.'; }
        if (no_user) { local_msg = local_msg + ' Nincs ilyen user.'; }
        if (timed_out) { local_msg = local_msg + ' Nincs kapcsolat.'; }
        message.channel.send(local_msg + ' https://cs.sankakucomplex.com/data/3d/0e/3d0e02f9ebd984d7af5891f693e82f6f.jpg');
    }
    bot.user.setGame(motd);

}

// nameify

function nameify(name) {
    var tags = name.split('_');
    var nameified = '';
    for (i in tags) {
        tags[i] = tags[i][0].toUpperCase() + tags[i].substr(1);
        nameified += tags[i] + ' ';
    }
    return nameified;
}

// nsfw filter

function nsfw_filter(message, lower, mode) {
    if (mode == 0) {
        if (lower.indexOf('rating:safe') <= 0 && message.channel.name != 'nsfw' && message.channel.name != 'fapmaterial' && message.channel.name != undefined) {
            var keresoszo = lower.substr(9);
            if (lower.indexOf('rating:explicit') >= 0 || lower.indexOf('rating:questionable')) {
                consoleLog(c.bgRed('NSFW search.'));
                while (keresoszo != keresoszo.replace('explicit', 'safe')) {
                    keresoszo = keresoszo.replace('explicit', 'safe');
                }
                while (keresoszo != keresoszo.replace('questionable', 'safe')) {
                    keresoszo = keresoszo.replace('questionable', 'safe');
                }
            }
            if (keresoszo.indexOf('rating:') <= 0) {
                keresoszo += ' rating:safe';
            }
            consoleLog(c.bgRed(keresoszo));
            //message.channel.send('Itt nem kereshetsz nsfw képet.\nDe semmi gond, kijavítottam a hibád.\n' + keresoszo);
            sankakuSearch(message, keresoszo, 0);
        } else {
            sankakuSearch(message, lower.substr(9), 0);
        }
    } else if (mode == 1) {
        if (lower.indexOf('rating:safe') <= 0 && message.channel.name != 'nsfw' && message.channel.name != 'fapmaterial' && message.channel.name != undefined) {
            var keresoszo = lower.substr(6);
            if (lower.indexOf('rating:explicit') >= 0 || lower.indexOf('rating:questionable')) {
                consoleLog(c.bgRed('NSFW search.'));
                while (keresoszo != keresoszo.replace('explicit', 'safe')) {
                    keresoszo = keresoszo.replace('explicit', 'safe');
                }
                while (keresoszo != keresoszo.replace('questionable', 'safe')) {
                    keresoszo = keresoszo.replace('questionable', 'safe');
                }
            }
            if (keresoszo.indexOf('rating:') <= 0) {
                keresoszo += ' rating:safe';
            }
            consoleLog(c.bgRed(keresoszo));
            //message.channel.send('Itt nem kereshetsz nsfw képet.\nDe semmi gond, kijavítottam a hibád.\n' + keresoszo);
            sankakuSearch(message, keresoszo, 1);
        } else {
            sankakuSearch(message, lower.substr(6), 1);
        }
    } else if (mode == 2) {
        if (message.channel.name != 'nsfw' && message.channel.name != 'fapmaterial' && message.channel.name != undefined) {
            var keresoszo = lower;
            if (lower.indexOf('rating:explicit') >= 0 || lower.indexOf('rating:questionable')) {
                consoleLog(c.bgRed('NSFW search.'));
                while (keresoszo != keresoszo.replace('rating:explicit', '')) {
                    keresoszo = keresoszo.replace('rating:explicit', '');
                }
                while (keresoszo != keresoszo.replace('rating:questionable', '')) {
                    keresoszo = keresoszo.replace('rating:questionable', '');
                }
            }
            if (keresoszo.indexOf('rating:') <= 0) {
                keresoszo += ' rating:safe';
            }
            consoleLog(c.bgRed(keresoszo));
            sankakuSearch(message, keresoszo, 2);
        } else {
            sankakuSearch(message, lower, 2);
        }
    } else if (mode == 3) {
        if (message.channel.name != 'nsfw' && message.channel.name != 'fapmaterial' && message.channel.name != undefined) {
            consoleLog(c.bgRed('Doujin search at wrong channel.'));
            message.channel.send('retard, itt nem kereshetsz.');
        } else {
            nhentaiSearch(message, lower);

        }
    }
}

// heartbeat functions

function amIdead(is_dc) {
    setTimeout(function () {
        if (!hb || is_dc) {
            consoleLog(c.bgRed.blue(getTime('full') + " I'm dead. Reloading..."));
            setTimeout(function () {
                if (!hb || is_dc) {
                    exit(3);
                }
            }, 5000);
        }
    }, 10000);
}

// tsundere switcher

function tsun_mode(message) {
    if (tsun) {
        tsun = false;
        consoleLog(c.bgBlue('## gekky currently is not tsundere.'));
        message.channel.send('O-okay.');
    }
    else {
        tsun = true;
        consoleLog(c.bgBlue('## gekky currently is tsundere.'));
        message.channel.send('Nah.');
    }
}

// blacklist checker

function isBlacklisted(message) {
    var value = false;
    var i = 0;
    while (i < blacklist.length && blacklist[i] != message.author.id) { i++; }
    if (i < blacklist.length) {
        value = true;
    }
    i = 0;
    while (i < channelblacklist.length && channelblacklist[i] != message.channel.id) { i++; }
    if (i < channelblacklist.length) {
        value = true;
    }
    return value;
}



// BOT EVENTS

bot.on('message', function (message) {
    var lower = message.content.toLowerCase();
    if (!isBlacklisted(message)) {
        msglogged = false;
        // heartbeat
        if (lower == '[online]' && message.author.username == bot.user.username) { hb = true; }
        // one word commands
        switch (lower) {
            case 'scuoa':
                message.channel.send('aoucs');
                messageConsoleLog(message, true);
                break;
            case 'multi':
                message.channel.send('kurwa');
                messageConsoleLog(message, true);
                break;
            case 'juj':
                message.channel.send('lyuly');
                messageConsoleLog(message, true);
                break;
            case 'ping':
                message.channel.send('Pong!');
                messageConsoleLog(message, true);
                break;
        }
        // complex commands
        if (lower.startsWith('loli') && message.author.username != bot.user.username) {
            message.channel.send('loliraid');
            messageConsoleLog(message, true);
        }
        if (lower.indexOf(',,') >= 0) {
            message.channel.send('nemnemnemNEMNEMNEM!!! Nem.');
            messageConsoleLog(message, true);
        }
        if (lower.indexOf('¯\\_(ツ)_/¯') >= 0 && message.author.username != bot.user.username) {
            message.channel.send('¯\\_(ツ)_/¯');
            messageConsoleLog(message, true);
        }
        if (lower.startsWith(cmdpref + "response")) {
            checkSecret(lower.substr(cmdpref.length + "response ".length), (valasz) => {
                message.channel.send(valasz);
            });
            messageConsoleLog(message, true);
        }

        // troll part
        if (lower == 'rop' && troll) {
            message.channel.send('rip');
            messageConsoleLog(message, true);
        }
        // tsundere part
        if (tsun) {
            if (lower.indexOf(':dddddd') >= 0 && message.author.username == bot.user.username) {
                setTimeout(function () {
                    message.edit('Nope.');
                }, 1000);
            }

            if (message.author.username != bot.user.username) {
                if (lower.indexOf('kurwa') >= 0 || lower.indexOf('kurva') >= 0) {
                    message.channel.send('Anyád.');
                    messageConsoleLog(message, true);
                }
                if (lower.indexOf('minden szar') >= 0) {
                    message.channel.send('A gmod nem szar.');
                    messageConsoleLog(message, true);
                }
                /*if (lower.indexOf('new score by') >=0 && message.channel.name == 'hun-scores'){
					message.channel.send('noob');
					messageConsoleLog(message,true);
				}*/
                if (lower.indexOf('tsun') >= 0 && lower.indexOf('bot') > 0) {
                    message.channel.send(dg.random(dg.def));
                    messageConsoleLog(message, true);
                }
                if (lower.indexOf('xd') >= 0) {
                    message.channel.send(dg.random(dg.xd));
                    messageConsoleLog(message, true);
                }
                if (lower.indexOf('zsolt') >= 0 && message.channel.id == '144787515268661248') {
                    message.channel.send(dg.random(dg.zsolt));
                    messageConsoleLog(message, true);
                }
                if (lower.indexOf('ante') >= 0 && message.channel.id == '144787515268661248') {
                    message.channel.send(dg.random(dg.ante));
                    messageConsoleLog(message, true);
                }
                if (lower.indexOf('nana') >= 0 && message.channel.id == '144787515268661248') {
                    message.channel.send(dg.random(dg.nana));
                    messageConsoleLog(message, true);
                }
                if (lower.indexOf('szabi') >= 0 && message.channel.id == '144787515268661248') {
                    message.channel.send(dg.random(dg.szabi));
                    messageConsoleLog(message, true);
                }
                if (lower.indexOf('márk') >= 0 && message.channel.id == '144787515268661248') {
                    message.channel.send(dg.random(dg.mark));
                    messageConsoleLog(message, true);
                }
                if (lower.indexOf('sono') >= 0 && message.channel.id == '144787515268661248') {
                    message.channel.send(dg.random(dg.sono));
                    messageConsoleLog(message, true);
                }
                if (lower == 'de') {
                    message.channel.send('Nem!');
                    messageConsoleLog(message, true);
                }
                if (lower == 'nem') {
                    message.channel.send('De!');
                    messageConsoleLog(message, true);
                }
                //TODO
                if ((lower.indexOf(bot.user.username) >= 0 || lower.indexOf('momi') >= 0 || lower.indexOf('m0mi') >= 0 || lower.indexOf('mom1') >= 0 || lower.indexOf('m0m1') >= 0 || lower.indexOf(bot.user.id) >= 0) && (lower.indexOf("reggel") < 0 || lower.indexOf("ohio"))) {
                    message.channel.send(dg.random(dg.emlites));
                    messageConsoleLog(message, true);
                }
                if (lower.startsWith('kus')) {
                    message.channel.send(dg.random(dg.kus));
                    messageConsoleLog(message, true);
                }
                if (lower.indexOf('slaps') >= 0 && lower.indexOf('<@') && message.author.username == 'Ratina') {
                    var elso, masodik;
                    elso = lower.substring(1, 22);
                    message.channel.send('*' + fullID + ' slaps ' + elso + '*');
                    messageConsoleLog(message, true);
                }
                if ((lower.indexOf('szia') >= 0 || lower == 'hi')) {
                    message.channel.send(dg.random(dg.hi));
                    messageConsoleLog(message, true);
                }
                if (lower.startsWith('jó éjt')) {
                    message.channel.send(dg.random(dg.hi));
                    messageConsoleLog(message, true);
                }
                if ((lower.indexOf('>.>') >= 0) || (lower.indexOf('<.<') >= 0)) {
                    message.channel.send(dg.random(dg.eye));
                    messageConsoleLog(message, true);
                }
                if ((lower.indexOf('jajne') >= 0 || lower.indexOf('jaj ne') >= 0)) {
                    message.channel.send('Jaj, de. :3');
                    messageConsoleLog(message, true);
                }
                if (lower.indexOf('osu.ppy.sh/ss') >= 0) {
                    message.channel.send("noob");
                    messageConsoleLog(message, true);
                }
                if (lower.indexOf('ayy') >= 0) {
                    message.channel.send('Ayy ayy ayy...');
                    messageConsoleLog(message, true);
                }
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
                    message.channel.send(dg.random(dg.proba));
                    messageConsoleLog(message, true);
                }
            }
        }
        // weather info
        if (lower.startsWith(cmdpref + 'weather')) {
            weatherInfo(lower.substr(cmdpref.length + 8), (response) => {
                message.channel.send({embed:response});
            });
            messageConsoleLog(message, true);
        }

        // sankaku search
        if (lower.startsWith(cmdpref + 'help')) {
            sendHelp(message);
            messageConsoleLog(message, true);
        }
        if (lower.startsWith(cmdpref + 'sankaku')) {
            nsfw_filter(message, lower, 0);
            messageConsoleLog(message, true);
        }
        if (lower.startsWith(cmdpref + 'news')) {
            nsfw_filter(message, lower, 1);
            messageConsoleLog(message, true);
        }
        if (lower.startsWith(cmdpref + 'touhou')) {
            nsfw_filter(message, 'touhou rating:safe solo ' + message.content.toString().substr(8), 2);
            messageConsoleLog(message, true);
        }
        if (lower.startsWith(cmdpref + 'sanka5')) {
            nsfw_filter(message, message.content.toString().substr(8), 2);
            messageConsoleLog(message, true);
        }
        if (lower.startsWith(cmdpref + 'nhentai')) {
            nsfw_filter(message, lower.substr(9), 3);
            messageConsoleLog(message, true);
        }

        // legekka-only commands
        if (message.author.username == 'legekka') {
            if (lower.startsWith(cmdpref + 'secret')) {
                giveSecret(lower.split(' ')[1],lower.split(' ')[2],(response) => {
                    message.channel.send(response);
                });
                messageConsoleLog(message, true);
            }
            // console commands
            if (lower.startsWith(cmdpref + 'remlist')) {
                reminderLister(lower.substr(cmdpref.length + 'remlist'.length + 1), (response) => {
                    message.channel.send({embed:response});
                });
                messageConsoleLog(message, true);
            }

            if ((lower.startsWith(cmdpref + 'workdayinfo'))) {
                workdayinfo((response) => {
                    message.channel.send({embed:response});
                });
                messageConsoleLog(message, true);
            }
            if ((lower.indexOf("reggel") >= 0 || lower.indexOf("ohio") >= 0) && (lower.indexOf("momi") >= 0 || lower.indexOf("gekk") >= 0)) {
                ohio(message);
                messageConsoleLog(message, true);
            }

            if (message.content.startsWith(cmdpref + 'motd')) {
                motd = lower.substr(6);
                bot.user.setGame(motd);
                messageConsoleLog(message, true);
            }
            if (lower == cmdpref + 'inv') {
                message.channel.send('https://discordapp.com/oauth2/authorize?&client_id=267741038230110210&scope=bot');
                messageConsoleLog(message, true);
            }
            if (lower == cmdpref + 'delcache') {
                code = execSync('rm -f ' + SankakuPath + '*');
                message.channel.send('Cache deleted.');
                messageConsoleLog(message, true);
            }
            if (message.content.startsWith(cmdpref + 'send')) {
                sendFile(message, message.content.substr(6));
            }
            if (lower.startsWith(cmdpref + 'cmdpref')) {
                cmdpref = lower.substr(9);
                if (cmdpref == '') {
                    cmdpref = '!';
                    message.channel.send('New prefix: `!`');
                    messageConsoleLog(message, true);
                } else {
                    message.channel.send('New prefix: `' + cmdpref + '`');
                    messageConsoleLog(message, true);
                }
            }
            if (lower == cmdpref + 'tsun') {
                tsun_mode(message);
            }
            if (lower == cmdpref + 'cache') {
                checkCache(SankakuPath, 50, message);
            }
            if (lower == cmdpref + 'reload') {
                exit(3);
            }
            if (lower == cmdpref + 'close') {
                exit(2);
            }
        }
        messageConsoleLog(message, false);
    }
});

bot.on('ready', function () {
    //bot.user.setStatus('online', motd);
    bot.user.setGame(motd);

    // first heartbeat
    if (!botonline) {
        bot.channels.get(ch.defaultID).send('[online]');
        botonline = true;
    }
});

bot.on('disconnected', function () {
    amIdead(true);
});

// CONSOLE EVENTS

inp.addListener('data', function (d) {
    var cmd = d.toString().trim();
    if (cmd.startsWith('>')) {
        bot.channels.get(ch.NtoI(ch.current)).send(cmd.substr(1));
    }
    else {
        cmd = cmd.toLowerCase();
        if (cmd == 'close') {
            exit(2);
        } else if (cmd == 'reload') {
            exit(3);
        } else if (cmd == 'stop') {
            exit(1);
        } else if (cmd.startsWith('go ')) {
            // TODO: megcsinálni azt a fancy IF-et, este már nem volt agyam hozzá
            // NNOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
            ch.current = cmd.substr(3);
            consoleLog(c.bgBlue('## gekky went to #' + ch.current));
            ch.NtoI(ch.current);
        } else if (cmd == 'cls') {
            console.log('\033c');
        } else if (cmd == 'vars') {
            consoleLog(c.bgBlue('#### Variable values ####\n\n  tsun = ' + tsun + '\n  troll = ' + troll + '\n  ch.current = #' + ch.current + '\n  counter = ' + counter + '\n\n#### END ####'));
        } else if (cmd == 'tsun_mode') {
            tsun_mode();
        } else if (cmd == 'troll_mode') {
            consoleLog(c.bgBlue('## TODO: troll_mode() function'));
        } else if (cmd == 'help') {
            fs.readFile(files.help, 'utf8', function (err, data) {
                if (err) throw err;
                console.log(data);
            });
        } else if (cmd == 'delcache') {
            code = execSync('rm -f ' + SankakuPath + '*');
        }
    }
});


var bugfixOldUser, bugfixNewUser;	//multiple event calling fixer variables

bot.on('presenceUpdate', function (oldUser, newUser) {
    if (oldUser.presence.status != bugfixOldUser && newUser.presence.status != bugfixNewUser) {
        bugfixOldUser = oldUser.presence.status;
        bugfixNewUser = newUser.presence.status;
        if (is_a_friend(oldUser.user.id)) {
            if (oldUser.presence.status != newUser.presence.status) {
                //console.log(statuscolor(newUser.presence.status,'██ ',0) + usercolor(newUser.user));
                consoleLog(statuscolor(newUser.presence.status, '##', 1) + usercolor(newUser.user));
                log(newUser.presence.status + ' : ' + oldUser.user.username + '\r\n');
            }
        }
    }
});


// FIRST COMMANDS
code = execSync('clear');
process.stdout.write(c.bgWhite.green('#'));
initialize();
process.stdout.write(c.bgWhite.green('#'));
bot.login(token);
process.stdout.write(c.bgWhite.green(' ' + getTime('date') + ' ' + getTime('time') + '\n'));
log('## ' + getTime('date') + ' ' + getTime('time') + '\r\n');
consoleLog(c.bgWhite.green('## gekky has been started.'));
code = execSync('rm -f ' + SankakuPath + '*');
amIdead(false);