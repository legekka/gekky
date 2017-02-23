// console.js
// gekky's conosole module

module.exports = function (bot) {
    var inp = process.openStdin();

    inp.addListener('data', (d) => {
        var cmd = d.toString().trim();
        var lower = cmd.toLowerCase();
        if (lower == 'teszt') {
            console.log('echo');
        }
        if (lower == 'teszt2') {
            bot.channels.get('281188840084078594').sendMessage('sikeres teszt');
        }
    })
}
