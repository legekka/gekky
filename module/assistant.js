// assistant.js
// ohio function

module.exports = {
    ohio: (message) => {
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
        delete require.cache[require.resolve('./weather.js')];
        require('./weather.js')("Budapest", (response) => {
            message.channel.send({embed:response});
        });
        delete require.cache[require.resolve('./workdayinfo.js')];
        require('./workdayinfo')((response) => {
            message.channel.send({embed:response});
        });
    }
}