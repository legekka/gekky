// nyugi csak egy vicc

function getID(message) {
    var id = message.content.split('@')[1].split('>')[0];
    if (id.indexOf('!') >= 0) {
        id = id.substr(1);
    }
    return id;
}


module.exports = {
    kill: (core, message) => {
        if (core.deadlist.indexOf(message.author.id) >= 0) {
            message.delete();
        }
    },
    adddeadlist: (core, message) => {
        core.deadlist.push(getID(message));
        return core;
    },
    remdeadlist: (core, message) => {
        core.deadlist.splice(core.deadlist.indexOf(getID(message)));
        return core;
    }
}