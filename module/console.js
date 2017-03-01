// console.js
// gekky's console module

module.exports = function (bot) {
    var inp = process.openStdin();

    inp.addListener('data', (d) => {
        if (d.toString().startsWith('>')) {
            // sending messages here from console
        } else {
            var cmd = d.toString().toLowerCase().trim();
            if (cmd == 'close' || cmd == 'stop') {
                bot.destroy().then(() => {
                    process.exit(1);
                })
            } else if (cmd == 'reload') {
                bot.destroy().then(() => {
                    process.exit(2);
                })
            } else {
                console.log('Ismeretlen parancs: ' + cmd);
            }
        }
    })
}
