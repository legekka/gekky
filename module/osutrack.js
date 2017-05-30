// osutrack.js
// tracking noobo hungariano oso playerso

const fs = require('fs');
var reqreload = require('./reqreload.js');

const apikey = fs.readFileSync('../osuapikey.txt').toString();
const path = './data/osu_scores.txt';
const userlistpath = './data/osu_scores_userlist.txt';
const https = require('https');
const c = require('chalk');

var osuapi = require('osu-api');
var osu = new osuapi.Api(apikey);

module.exports = {
    top20list: () => { generateTop20list(); },
    defaultScores: () => { getDefaultScores(); },
    checkScores: (core) => { checkForNewScores(core) },
    startChecker: (core) => {
        if (!core.osutrack_running) {
            checkForNewScores(core);
            console.log(c.green('[OT]') + ' osutrack started');
            core.osutrack_running = true;
            core.osutrack = setInterval(() => {
                checkForNewScores(core);
            }, 60000);
        } else {
            console.log(c.green('[OT]') + ' osutrack is already started');
        }
        return core.osutrack;
    },
    stopChecker: (core) => {
        core.osutrack_running = false;
        console.log(c.green('[OT]') + ' osutrack stopped');
        clearInterval(core.osutrack);
        return core;
    }
}

function checkForNewScores(core) {
    var userlist = fs.readFileSync(userlistpath).toString().split('\n');
    for (i in userlist) {
        osu.getUserRecent(userlist[i], (err, output) => {
            if (err) {
                console.log(err);
            }
            if (output != null) {
                if (output[0] != undefined) {
                    for (i in output) {
                        if (isNewScore(output[i])) {
                            if (output[i].rank != 'F') {
                                var filePath = '../cache/' + fnamefix(output[i].user_id + '_' + output[i].date) + '.png';
                                createPlayCard(output[i], playcard => {
                                    var ppvalue = parseFloat(playcard.pp.substr(0, playcard.pp.length - 2));
                                    console.log(ppvalue);
                                    if (ppvalue > 300) {
                                        reqreload('./playcard.js')(playcard, filePath).then(() => {
                                            reqreload('./webpconvert.js').file(filePath, (filep) => {
                                                core.bot.channels.get(core.ch.hun_scores).sendFile(filep);
                                                console.log(c.green('[OT] ') + reqreload('./getTime.js')() + ' | New score by ' + playcard.player.username);
                                            });
                                        });
                                    } else {
                                        reqreload('./playcard.js')(playcard, filePath).then(() => {
                                            reqreload('./webpconvert.js').file(filePath, (filep) => {
                                                core.bot.channels.get(core.ch.hun_scorespam).sendFile(filep);
                                                console.log(c.green('[OT] ') + reqreload('./getTime.js')() + ' | New score by ' + playcard.player.username);
                                            });
                                        });
                                    }

                                });
                            }
                            addAsOld(output[i]);
                        }
                    }
                }
            }
        })
    }
}

function getDefaultScores() {
    var userlist = fs.readFileSync(userlistpath).toString().split('\n');
    var playerlist = [];

    fs.writeFileSync(path, '');
    for (i in userlist) {
        osu.getUserRecent(userlist[i], (err, output) => {
            var player = {
                'id': '',
                'dates': []
            }
            if (output[0] != undefined) {
                player.id = output[0].user_id;
            }
            for (j in output) {
                player.dates.push(output[j].date);
            }
            playerlist.push(player);

        });
    }
    var waiter = setInterval(() => {
        if (playerlist.length == 20) {
            clearInterval(waiter);
            for (i in userlist) {
                playerlist[i].id = userlist[i];
                if (i < userlist.length - 1) {
                    fs.appendFileSync(path, JSON.stringify(playerlist[i]) + '\n');
                } else {
                    fs.appendFileSync(path, JSON.stringify(playerlist[i]));
                }
            }
        }
    }, 100);
}

function generateTop20list() {
    httpsGet('https://osu.ppy.sh/p/pp/?c=HU&m=0&s=3&o=1&f=0&page=1', '../cache/userlist.html', () => {
        var text = fs.readFileSync('../cache/userlist.html').toString().split('\n');
        fs.writeFileSync(userlistpath, '');
        var counter = 0;
        for (i in text) {
            if (text[i].indexOf('/u/') >= 0 && text[i].indexOf('document.location') < 0) {
                counter++;
                if (counter <= 20) {
                    var str = text[i].substr(text[i].indexOf('/u/') + 3, text[i].length);
                    str = str.substr(0, str.indexOf("'"));
                    if (counter == 20) {
                        fs.appendFileSync(userlistpath, str);
                    } else {
                        fs.appendFileSync(userlistpath, str + '\n');
                    }
                } else {
                    break;
                }
            }
        }
    });
}

function isNewScore(score) {
    var userid = score.user_id;
    var text = fs.readFileSync(path).toString().split('\n');
    var oldscores = [];
    for (i in text) {
        oldscores.push(JSON.parse(text[i]));
    }
    var i = 0;
    while (oldscores[i].id != userid && i < oldscores.length) { i++; }
    if (i >= oldscores.length) {
        return false;
    } else {
        var j = 0;
        while (score.date != oldscores[i].dates[j] && j < oldscores[i].dates.length) { j++; }
        if (j < oldscores[i].dates.length) {
            return false;
        } else {
            return true;
        }
    }
}

function createPlayCard(score, callback) {
    var playcard = {
        'player': {
            'avatar': 'https://a.ppy.sh/' + score.user_id,
            'username': '',
            'global_rank': '',
            'country_rank': '',
            'allpp': ''
        },
        'play': {
            'rank': getRank(score),
            'score': score.score,
            'combo': score.maxcombo + 'x',
            'acc': getAccuracy(score) + '%',
            'mods': getMods(score.enabled_mods),
            'pp': ''
        },
        'map': {
            'background': '',
            'title': '',
            'diff': '',
            'length': '',
            'bpm': '',
            'sdiff': '',
            'maxcombo': '',
            'cs': '',
            'ar': '',
            'od': '',
            'hp': ''
        }
    }

    // pp calc
    reqreload('./getpp.js')(score.beatmap_id, playcard.play.acc, playcard.play.combo, score.countmiss, playcard.play.mods, (pp) => {
        playcard.play.pp = pp + 'pp';
    });

    var userdone = false;
    osu.getUser(parseInt(score.user_id), (err, output) => {
        playcard.player.username = output.username;
        playcard.player.global_rank = '#' + output.pp_rank;
        playcard.player.country_rank = '#' + output.pp_country_rank;
        playcard.player.allpp = allppformat(output.pp_raw);
        userdone = true;
    });

    var beatmapdone = false;
    osu.getBeatmap(score.beatmap_id, (err, output) => {
        playcard.map.background = 'https://b.ppy.sh/thumb/' + output.beatmapset_id + 'l.jpg'
        playcard.map.title = output.artist + ' - ' + output.title;
        playcard.map.diff = '[' + output.version + ']';
        playcard.map.length = timeformat(output.total_length);
        playcard.map.bpm = output.bpm + 'bpm';
        playcard.map.sdiff = sdiffformat(output.difficultyrating);
        playcard.map.maxcombo = output.max_combo + 'x';
        playcard.map.cs = 'cs' + output.diff_size;
        playcard.map.ar = 'ar' + output.diff_approach;
        playcard.map.od = 'od' + output.diff_overall;
        playcard.map.hp = 'hp' + output.diff_drain;
        beatmapdone = true;
    });

    var waiter = setInterval(() => {
        if (userdone && beatmapdone) {
            clearInterval(waiter);
            return callback(playcard);
        }
    }, 100);

}

function fnamefix(str) {
    var string = str;
    while (string.indexOf(' ') >= 0) { string = string.replace(' ', '_'); }
    while (string.indexOf(':') >= 0) { string = string.replace(':', '.'); }
    return string;
}




function allppformat(allpp) {
    var left = parseInt(allpp.split('.')[0]);
    if (left >= 1000) {
        return allpp[0] + ' ' + allpp.substr(1, allpp.length) + 'pp';
    } else {
        return allpp + 'pp';
    }
}

function sdiffformat(sdiff) {
    var int = Math.round(parseFloat(sdiff) * 100);
    var left = Math.floor(int / 100);
    var right = int - left * 100;
    if (right < 10) {
        return left + '.0' + right + '*';
    } else {
        return left + '.' + right + '*';
    }
}


function timeformat(secs) {
    parseInt(secs);
    var min = Math.floor(secs / 60);
    var sec = secs - min * 60;
    if (sec < 10) {
        return min + ':0' + sec;
    } else {
        return min + ':' + sec;
    }
}



function getRank(score) {
    switch (score.rank) {
        case "X":
            return "SS";
        case "XH":
            return "SS";
        case "SH":
            return "S";
        default:
            return score.rank;
    }
}

function getAccuracy(score) {
    var count300 = parseInt(score.count300);
    var count100 = parseInt(score.count100);
    var count50 = parseInt(score.count50);
    var countmiss = parseInt(score.countmiss);

    var score3 = count300 * 300;
    var score1 = count100 * 100;
    var score5 = count50 * 50;

    var divider = (count300 + count100 + count50 + countmiss) * 300;

    return (((score3 + score1 + score5) * 1.0 / divider) * 100).toFixed(2);
}

function getMods(EnabledMods) {
    if (EnabledMods == 0)
        return "NoMod";

    var Mods = EnabledMods;
    var FinalMods = "";

    var Source = `NoMod: 0,NF: 1,EZ: 2,No Video: 4,HD: 8,HR: 16,SD: 32,DT: 64,RX: 128,HT: 256,NC: 512,FL: 1024,Auto play: 2048,SO: 4096,Auto Cursor: 8192,PF: 16384,Key4: 32768,Key5: 65536,Key6: 131072,Key7: 262144,Key8: 524288,Keys: -1,Fade In: 1048576,Random: 2097152,Last Mod: 4194304,Free Mod Allowed: -2,Key9: 16777216,Key10: 33554432,Key1: 67108864,Key3: 134217728,Key2: 268435456`;

    var Values = [];
    var Names = [];

    Source.split(',').forEach((v, i, a) => {
        var KeyValuePair = v.split(':');

        Names.push(KeyValuePair[0]);
        var Value = parseInt(KeyValuePair[1].trim());

        if (Value == -1) {
            Value = 32768 | 65536 | 131072 | 262144 | 524288;
        }
        else if (Value == -2) {
            Value = 1 | 2 | 8 | 16 | 32 | 1024 | 1048576 | 128 | 8192 | 4096 | 32768 | 65536 | 131072 | 262144 | 524288;
        }

        Values.push(Value);
    });

    for (var i = 30; i != 0; i--) {
        var Value = Values[i];

        if (Mods >= Value) {
            Mods -= Value;

            if (FinalMods != "")
                FinalMods += "";

            FinalMods += Names[i];
        }
    }
    FinalMods = FinalMods.substring(0);
    return FinalMods;
}

function addAsOld(score) {
    var text = fs.readFileSync(path).toString().split('\n');
    var oldscores = [];
    for (i in text) {
        oldscores.push(JSON.parse(text[i]));
    }
    var i = 0;
    while (score.user_id != oldscores[i].id) { i++; }
    if (i < oldscores.length) {
        oldscores[i].dates.push(score.date);
    } else {
        console.log('Ajjaj.');
    }
    fs.writeFileSync(path, '');
    for (i in oldscores) {
        if (i < oldscores.length - 1) {
            fs.appendFileSync(path, JSON.stringify(oldscores[i]) + '\n');
        } else {
            fs.appendFileSync(path, JSON.stringify(oldscores[i]));
        }
    }
}

function httpsGet(url, filename, callback) {
    var downloadedfile = fs.createWriteStream(filename);
    done = false;
    var request = https.get(url, function (response) {
        response.pipe(downloadedfile, { end: false });
        response.on('end', () => {
            done = true;
        });
    });
    var waiter = setInterval(() => {
        if (done) {
            clearInterval(waiter);
            return callback();
        }
    }, 100);
}