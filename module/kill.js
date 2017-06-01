// nyugi csak egy vicc

module.exports = {
    kill: (core, message) => {
        if (core.deadlist.indexOf(message.author.username) >= 0) {
            message.delete();
        }
    },
    adddeadlist: (core, name) => {
        core.deadlist.push(name);
        return core;
    },
    remdeadlist: (core, name) => {
        core.deadlist.splice(core.deadlist.indexOf(name));
        return core;
    }
}