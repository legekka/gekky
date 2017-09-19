// music.js
// voice and music things


var music = {
    teszt: (core) => {
        var vchannels = core.discord.bot.channels.findAll('type', 'voice');
        var i = -1;
        var megvan = false;
        do {
            i++;
            if (vchannels[i].members != undefined) {
                var members = vchannels[i].members.array();
                if (members.length != 0) {
                    var j = 0;
                    while (j < members.length && members[j].user.username != 'legekka') {
                        j++;
                    }
                    if (j < members.length) { megvan = true; }

                }
            } else {
                console.log('legekka isnt on any voice channel or idk');
                return;
            }
        } while (i < vchannels.length && !megvan);
        console.log(megvan);
        console.log(vchannels[i].name);
        music.connect(vchannels[i]).then(connection => {
            console.log('connected.');
            const dispatcher = connection.playFile('../music.mp3');
            dispatcher.setVolume(0.1);
            dispatcher.on('end', () => {
                connection.disconnect();
            });
        });
    },
    connect: (voiceChannel) => {
        return new Promise((resolve, reject) => {
            voiceChannel.join().then(connection => {
                resolve(connection);
            }).catch(err => {
                reject(err);
            })
        })
    }
}