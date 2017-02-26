// core.js
// core of the bot

module.exports = (bot, token) => {
    const fs = require('fs');
    require('./module/console.js')(bot);

    var tsun = true;    // tsundere mode
    var cmdpref = '!';   // default command prefix

    var ch = {
        'main': '281188840084078594',
    }

    bot.login(token);

    bot.on('ready', function () {
        bot.channels.get(ch.main).sendMessage('[online]');
        console.log('[online]');
        bot.user.setGame('Re:Born [Alpha]');
    });

    bot.on('message', (message) => {
        delete require.cache[require.resolve('./module/talk.js')];
        require('./module/talk.js')(bot, message, tsun, cmdpref);
        delete require.cache[require.resolve('./module/command.js')];
        require('./module/command.js')(bot, message, cmdpref, (response) => {
            if (response != undefined) {
                switch (response.mode) {
                    case 'cmdpref': cmdpref = response.cmdpref;
                        break;
                    case 'tsun': tsun = response.tsun;
                }
            }
        });
    })
}