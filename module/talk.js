// talk.js
// talking part, including tsundere mode


var talk = {
    path: config.talk.path,
    dg: JSON.parse(fs.readFileSync(talk.path).toString()),
    default: (core, message) => {
        tsun = core.discord.dsettings.getTsun(message.guild.id);
        cmdpref = core.discord.dsettings.getCmdpref(message.guild.id);
        var lower = message.content.toLowerCase();
        if (lower.indexOf('gekky') >= 0 &&
            message.channel.id != core.discord.ch.gekkylog &&
            message.channel.id != core.discord.ch.osuirc &&
            message.channel.id != core.discord.ch.gekkyerrorlog &&
            message.channel.id != core.discord.ch.webps) {
            channelpicker.come(core, message);
        }
        if (!blacklist.isBlacklisted(message)) {
            if (lower == ':dddddd' && message.author.username == core.discord.bot.user.username) {
                setTimeout(() => {
                    message.edit('Nope.');
                }, 1000);
            }
            else if (message.author.username != core.discord.bot.user.username) {
                if (lower == 'ping') {
                    message.channel.send('Pong!');
                }
                else if (lower == 'juj') {
                    message.channel.send('lyuly');
                }
                else if (lower.indexOf('loli') >= 0) {
                    message.channel.send('loliraid');
                }
                else if (lower.indexOf(',,') >= 0) {
                    message.channel.send('nemnemnemNEMNEMNEM!!! Nem.');
                }
                else if (lower.indexOf('¯\\_(ツ)_/¯') >= 0) {
                    message.channel.send('¯\\_(ツ)_/¯');
                }
                else if (tsun) {
                    if (lower.indexOf('kurwa') >= 0 || lower.indexOf('kurva') >= 0) {
                        message.channel.send('Anyád.');
                    }
                    else if (lower.indexOf('minden szar') >= 0) {
                        message.channel.send('A gmod nem szar.');
                    }
                    else if (lower.indexOf('tsun') >= 0 && lower.indexOf('bot') > 0) {
                        message.channel.send(talk.random(dg.def));
                    }
                    else if (lower.indexOf('xd') >= 0) {
                        message.channel.send(talk.random(dg.xd));
                    }
                    else if (lower.indexOf('zsolt') >= 0 && message.channel.id == '144787515268661248') {
                        message.channel.send(talk.random(dg.zsolt));
                    }
                    else if (lower.indexOf('ante') >= 0 && message.channel.id == '144787515268661248') {
                        message.channel.send(talk.random(dg.ante));
                    }
                    else if (lower.indexOf('nana') >= 0 && message.channel.id == '144787515268661248') {
                        message.channel.send(talk.random(dg.nana));
                    }
                    else if (lower.indexOf('szabi') >= 0 && message.channel.id == '144787515268661248') {
                        message.channel.send(talk.random(dg.szabi));
                    }
                    else if (lower.indexOf('márk') >= 0 && message.channel.id == '144787515268661248') {
                        message.channel.send(talk.random(dg.mark));
                    }
                    else if (lower.indexOf('sono') >= 0 && message.channel.id == '144787515268661248') {
                        message.channel.send(talk.random(dg.sono));
                    }
                    else if (lower == 'de') {
                        message.channel.send('Nem!');
                    }
                    else if (lower == 'nem') {
                        message.channel.send('De!');
                    }
                    //TODO
                    else if ((lower.indexOf(core.discord.bot.user.username) >= 0 ||/* lower.indexOf('momi') >= 0 ||*/ lower.indexOf('m0mi') >= 0 || lower.indexOf('mom1') >= 0 || lower.indexOf('m0m1') >= 0 || lower.indexOf(core.discord.bot.user.id) >= 0) && (lower.indexOf("reggel") < 0 || lower.indexOf("ohio"))) {
                        message.channel.send(talk.random(dg.emlites));
                    }
                    else if (lower.startsWith('kus')) {
                        message.channel.send(talk.random(dg.kus));
                    }
                    else if ((lower.indexOf('szia') >= 0 || lower == 'hi')) {
                        message.channel.send(talk.random(dg.hi));
                    }
                    else if (lower.indexOf('jó éjt') >= 0) {
                        message.channel.send(talk.random(dg.hi));
                    }
                    else if ((lower.indexOf('>.>') >= 0) || (lower.indexOf('<.<') >= 0)) {
                        message.channel.send(talk.random(dg.eye));
                    }
                    else if (lower.indexOf('jajne') >= 0 || lower.indexOf('jaj ne') >= 0) {
                        message.channel.send('Jaj, de. :3');
                    }
                    else if (lower.indexOf('osu.ppy.sh/ss') >= 0) {
                        message.channel.send("noob");
                    }
                    else if (lower.indexOf('ayy') >= 0) {
                        message.channel.send('Ayy ayy ayy...');
                    } else if (lower.indexOf('nazi') >= 0 || lower.indexOf('náci') >= 0 && lower.indexOf('mod') >= 0) {
                        message.channel.send('https://legekka.s-ul.eu/fC1ku6D2.jpg');
                    }
                }
            }
        }
    },
    wrongcommand: (message) => {
        message.channel.send(talk.random(dg.proba));
    },
    random: (array) => {
        return array[Math.round(Math.random() * array.length) - 1];
    }
}