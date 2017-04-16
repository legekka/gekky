// music.js
// voice and music things


module.exports = (core) => {
    var vchannels = core.bot.channels.findAll('type', 'voice');
    var i = -1;
    var megvan = false;
    do {
        i++;
        var members = vchannels[i].members.array();
        if (members.length != 0) {
            var j = 0;
            while (j < members.length && members[j].user.username != 'legekka') {
                j++;
            }
            if (j < members.length) { megvan = true; }
        }
    } while (i < vchannels.length && !megvan);
    console.log(megvan);
    console.log(vchannels[i].name);
    connect(vchannels[i]).then(connection => {
        console.log('connected.');
        const dispatcher = connection.playFile('../music.mp3');
        dispatcher.setVolume(0.1);
        dispatcher.on('end', () => {
            connection.disconnect();
        });
    });
}

function connect(voiceChannel) {
    return new Promise((resolve, reject) => {
        voiceChannel.join().then(connection => {
            resolve(connection);
        }).catch(err => {
            reject(err);
        })
    })
}