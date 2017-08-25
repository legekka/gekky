// core.js
// core of gekky

var reqreload = require('./module/reqreload.js');
var fs = require('fs');

var core = {
    'autorun': {
        'processhandler': true,
        'console': true,
        'discord': true,
        'irc': true,
        'osutrack': true,
        'heartbeat': true,
        'cachemanager': true,
        'yrexia': true,
        'waifucloud': true,
        'memwatch': true
    },
    'cachelimit': 50,
    'discord': {
        'bot': undefined,
        'ready': false,
        'token': JSON.parse(fs.readFileSync('./data/passwords.json').toString()).discord,
        'ownerID': JSON.parse(fs.readFileSync('./data/passwords.json').toString()).ownerID,
        'creatorID': "143399021740818432",
        // guild settings
        'dsettings': reqreload('./dsettings.js'),
        'servers': [],
        'picker': {
            'id': '',
            'server': false,
            'channel': false
        },
        'ch': {
            'main': '281188840084078594',
            'gekkylog': '281189261355515915',
            'gekkyerrorlog': '303610093226819584',
            'osuirc': '289509321446916096',
            'webps': '299862573078151178',
            'hun_scores': '261144312387993610',
            'hun_scorespam': '319115815783759872',
            'current': '281188840084078594',
            'osuscores': '347807562202218498'
        },
        // heartbeat interval
        'heartbeat': {
            'interval': undefined,
            'state': undefined
        }
    },
    // osu!irc part
    'osuirc': {
        'client': undefined,
        'pw': JSON.parse(fs.readFileSync('./data/passwords.json').toString()).osuirc,
        'ready': false,
        'channel': 'legekka',
        'pin': ''
    },
    // osu!track part
    'osutrack': {
        'client': undefined,
        'ready': false,
    },
    // yrexia part
    'holopadip': '',
    // waifucloud client
    'waifucloud': {
        "client": undefined,
        "connection": undefined,
        "waifuEmitter": undefined,
        "sync": undefined,
        "autoconnect": undefined,
        //"speed": undefined
    }
}

// starting modules
core.autorun.console ? require('./module/console.js')(core) : null
core.autorun.discord ? require('./module/discord.js').start(core) : null
core.autorun.cachemanager ? require('./module/cachemanager.js').start(core) : null
core.autorun.yrexia ? require('./module/yrexia.js').start(core) : null
core.autorun.waifucloud ? require('./module/waifucloud.js').start(core) : null
core.autorun.memwatch ? require('./module/memwatch.js').start(core) : null
core.autorun.processhandler ? require('./module/processhandler.js').start(core) : null