// osutrack.js
// tracking noobo hungariano oso playerso


var osutrack = {
    path: config.osutrack.path,
    userlistpath: config.osutrack.userlistpath,
    playpath: config.osutrack.playpath,
    top20list: () => {
        osutrack.httpsGet('https://osu.ppy.sh/p/pp/?c=HU&m=0&s=3&o=1&f=0&page=1', '../cache/userlist.html', () => {
            var text = fs.readFileSync('../cache/userlist.html').toString().split('\n');
            fs.writeFileSync(osutrack.userlistpath, '');
            var counter = 0;
            for (i in text) {
                if (text[i].indexOf('/u/') >= 0 && text[i].indexOf('document.location') < 0) {
                    counter++;
                    if (counter <= 20) {
                        var str = text[i].substr(text[i].indexOf('/u/') + 3, text[i].length);
                        str = str.substr(0, str.indexOf('"'));
                        if (counter == 20) {
                            fs.appendFileSync(osutrack.userlistpath, str);
                        } else {
                            fs.appendFileSync(osutrack.userlistpath, str + '\n');
                        }
                    } else {
                        break;
                    }
                }
            }
        });
    },
    defaultScores: () => {
        var userlist = fs.readFileSync(osutrack.userlistpath).toString().split('\n');
        var playerlist = [];

        fs.writeFileSync(osutrack.path, '');
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
                        fs.appendFileSync(osutrack.path, JSON.stringify(playerlist[i]) + '\n');
                    } else {
                        fs.appendFileSync(osutrack.path, JSON.stringify(playerlist[i]));
                    }
                }
            }
        }, 100);
    },
    checkScores: (core) => { osutrack.checkForNewScores(core) },
    startChecker: (core) => {
        if (!core.osutrack.ready) {
            osutrack.checkForNewScores(core);
            console.log(c.green('[OT]') + ' osutrack started');
            core.osutrack.ready = true;
            core.osutrack.client = setInterval(() => {
                osutrack.checkForNewScores(core);
            }, 60000);
        } else {
            console.log(c.green('[OT]') + ' osutrack is already started');
        }
        return core.osutrack.client;
    },
    stopChecker: (core) => {
        core.osutrack.ready = false;
        console.log(c.green('[OT]') + ' osutrack stopped');
        clearInterval(core.osutrack.client);
        return core;
    },
    saveScore: (playcard) => {
        fs.appendFileSync(osutrack.playpath, JSON.stringify(playcard) + '\n');
    },
    checkForNewScores: (core) => {
        var userlist = fs.readFileSync(osutrack.userlistpath).toString().split('\n');
        for (i in userlist) {
            osu.getUserRecent(userlist[i], (err, output) => {
                if (err) {
                    //console.log(err);
                }
                if (output != null) {
                    if (output[0] != undefined) {
                        for (i in output) {
                            if (osutrack.isNewScore(output[i])) {
                                if (output[i].rank != 'F') {
                                    var filePath = '../cache/' + osutrack.fnamefix(output[i].user_id + '_' + output[i].date) + '.png';
                                    osutrack.createPlayCard(output[i], playcard => {
                                        if (playcard.map.background == 'Err' || playcard.player.username == 'Err') {
                                            core.discord.bot.channels.get(core.discord.ch.hun_scorespam).send('[osu!api error]');
                                            console.log(c.green('[OT] ') + getTime() + ' osu!api error');
                                        } else {
                                            playcard.playcard(playcard, filePath).then(() => {
                                                webpconvert.file(filePath, (filep) => {
                                                    var ppvalue = parseFloat(playcard.play.pp.substr(0, playcard.play.pp.length - 2));
                                                    if (ppvalue > 300) {
                                                        core.discord.bot.channels.get(core.discord.ch.hun_scores).send({ files: [filep] });
                                                    } else {
                                                        core.discord.bot.channels.get(core.discord.ch.hun_scorespam).send({ files: [filep] });
                                                    }
                                                    if (ppvalue >= 200) {
                                                        core.discord.bot.channels.get(core.discord.ch.osuscores).send({ files: [filep] });
                                                    }
                                                    osutrack.saveScore(playcard);
                                                    console.log(c.green('[OT] ') + getTime() + ' | New score by ' + playcard.player.username + ' | ' + playcard.play.pp);
                                                });
                                            });
                                        }
                                    });
                                }
                                osutrack.addAsOld(output[i]);
                            }
                        }
                    }
                }
            })
        }
    },
    isNewScore: (score) => {
        var userid = score.user_id;
        var text = fs.readFileSync(osutrack.path).toString().split('\n');
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
    },
    createPlayCard: (score, callback) => {
        var playcard = {
            'player': {
                'avatar': 'https://a.ppy.sh/' + score.user_id,
                'username': '',
                'global_rank': '',
                'country_rank': '',
                'allpp': ''
            },
            'play': {
                'rank': osutrack.getRank(score),
                'score': score.score,
                'combo': score.maxcombo + 'x',
                'acc': osutrack.getAccuracy(score) + '%',
                'mods': osutrack.getMods(score.enabled_mods),
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
        getpp.getpp(score.beatmap_id, playcard.play.acc, playcard.play.combo, score.countmiss, playcard.play.mods, (pp) => {
            playcard.play.pp = pp + 'pp';
        });

        var userdone = false;
        osu.getUser(parseInt(score.user_id), (err, output) => {
            if (output != null) {
                playcard.player.username = output.username;
                playcard.player.global_rank = '#' + output.pp_rank;
                playcard.player.country_rank = '#' + output.pp_country_rank;
                playcard.player.allpp = osutrack.allppformat(output.pp_raw);
                userdone = true;
            } else {
                playcard.player.username = 'Err';
                playcard.player.global_rank = 'Err';
                playcard.player.country_rank = 'Err';
                playcard.player.allpp = 'Err';
                userdone = true;
            }
        });

        var beatmapdone = false;
        osu.getBeatmap(score.beatmap_id, (err, output) => {
            if (output != null) {
                if (output.creator.toString().toLowerCase() != "monstrata") {
                    playcard.map.background = 'https://b.ppy.sh/thumb/' + output.beatmapset_id + 'l.jpg'
                    playcard.map.title = output.artist + ' - ' + output.title;
                    playcard.map.diff = '[' + output.version + ']';
                    playcard.map.length = osutrack.timeformat(output.total_length);
                    playcard.map.bpm = output.bpm + 'bpm';
                    playcard.map.sdiff = osutrack.sdiffformat(output.difficultyrating);
                    playcard.map.maxcombo = output.max_combo + 'x';
                    playcard.map.cs = 'cs' + output.diff_size;
                    playcard.map.ar = 'ar' + output.diff_approach;
                    playcard.map.od = 'od' + output.diff_overall;
                    playcard.map.hp = 'hp' + output.diff_drain;
                    beatmapdone = true;
                } else {
                    playcard.map.background = 'Err'
                    playcard.map.title = 'Err';
                    playcard.map.diff = 'Err';
                    playcard.map.length = 'Err';
                    playcard.map.bpm = 'Err';
                    playcard.map.sdiff = 'Err';
                    playcard.map.maxcombo = 'Err';
                    playcard.map.cs = 'Err';
                    playcard.map.ar = 'Err';
                    playcard.map.od = 'Err';
                    playcard.map.hp = 'Err';
                    beatmapdone = true;
                }
            } else {
                playcard.map.background = 'Err'
                playcard.map.title = 'Err';
                playcard.map.diff = 'Err';
                playcard.map.length = 'Err';
                playcard.map.bpm = 'Err';
                playcard.map.sdiff = 'Err';
                playcard.map.maxcombo = 'Err';
                playcard.map.cs = 'Err';
                playcard.map.ar = 'Err';
                playcard.map.od = 'Err';
                playcard.map.hp = 'Err';
                beatmapdone = true;
            }
        });

        var waiter = setInterval(() => {
            if (userdone && beatmapdone) {
                clearInterval(waiter);
                return callback(playcard);
            }
        }, 100);

    },
    fnamefix: (str) => {
        var string = str;
        while (string.indexOf(' ') >= 0) { string = string.replace(' ', '_'); }
        while (string.indexOf(':') >= 0) { string = string.replace(':', '.'); }
        return string;
    },
    allppformat: (allpp) => {
        var left = parseInt(allpp.split('.')[0]);
        if (left >= 1000) {
            return allpp[0] + ' ' + allpp.substr(1, allpp.length) + 'pp';
        } else {
            return allpp + 'pp';
        }
    },
    sdiffformat: (sdiff) => {
        var int = Math.round(parseFloat(sdiff) * 100);
        var left = Math.floor(int / 100);
        var right = int - left * 100;
        if (right < 10) {
            return left + '.0' + right + '*';
        } else {
            return left + '.' + right + '*';
        }
    },
    timeformat: (secs) => {
        parseInt(secs);
        var min = Math.floor(secs / 60);
        var sec = secs - min * 60;
        if (sec < 10) {
            return min + ':0' + sec;
        } else {
            return min + ':' + sec;
        }
    },
    getRank: (score) => {
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
    },
    getAccuracy: (score) => {
        var count300 = parseInt(score.count300);
        var count100 = parseInt(score.count100);
        var count50 = parseInt(score.count50);
        var countmiss = parseInt(score.countmiss);

        var score3 = count300 * 300;
        var score1 = count100 * 100;
        var score5 = count50 * 50;

        var divider = (count300 + count100 + count50 + countmiss) * 300;

        return (((score3 + score1 + score5) * 1.0 / divider) * 100).toFixed(2);
    },
    getMods: (EnabledMods) => {
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
    },
    addAsOld: (score) => {
        var text = fs.readFileSync(osutrack.path).toString().split('\n');
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
        fs.writeFileSync(osutrack.path, '');
        for (i in oldscores) {
            if (i < oldscores.length - 1) {
                fs.appendFileSync(osutrack.path, JSON.stringify(oldscores[i]) + '\n');
            } else {
                fs.appendFileSync(osutrack.path, JSON.stringify(oldscores[i]));
            }
        }
    },
    httpsGet: (url, filename, callback) => {
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
}

