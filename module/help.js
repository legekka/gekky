// help.js
// getting command list


var help = {
    list: (message, commands, core, callback) => {
        var entrylist = [];
        text = fs.readFileSync('./module/command.js').toString().split('\n');
        var legekka_only = false;
        for (i in text) {
            //text[i] = text[i].trim();
            if (!text[i].startsWith('//')) {
                if (text[i].indexOf('help: "') >= 0){
                    let index = text[i].indexOf('help: "');
                    let command = text[i].split('|')[0].substr(index + 8);
                    let cmd = commands[command];

                    if (!cmd)
                        continue;

                    let desc = text[i].split('|')[1];

                    if (!desc)
                        continue;

                    desc = desc.substr(0, desc.lastIndexOf('"'));
                    
                    if (core.discord.dsettings.level(core, message.author.id, message.guild.id) >= cmd.level){
                        entrylist.push({
                            'cmd': command,
                            'desc': desc
                        });
                    }
                }
            }
        }
        return callback(entrylist);
    }
}