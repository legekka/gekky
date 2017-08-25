var fs = require('fs');
var guildSettingsPath = './data/guildSettings.json';
if (!fs.existsSync(guildSettingsPath))
    fs.writeFileSync(guildSettingsPath, "{}");

var guildSettings;

if (fs.existsSync(guildSettingsPath)) {
    guildSettings = JSON.parse(fs.readFileSync(guildSettingsPath).toString());
}
function get(guildID) {
    var guildSetting = guildSettings[guildID];
    if (!guildSetting) {
        guildSetting = {
            cmdpref: "!",
            tsun: true,
            deadlist: [],
            admins: []
        };
        guildSettings[guildID] = guildSetting;
        save();
    }
    return guildSetting;
}
function getValue(guildID, type) {
    return get(guildID)[type];
}
function setValue(guildID, type, value) {
    var guildSetting = get(guildID);
    if (guildSetting[type] instanceof Array) {
        if (!contains(guildID, type, value))
            guildSetting[type].push(value);
    }
    else {
        guildSetting[type] = value;
    }
    guildSettings[guildID] = guildSetting;
    save();
}
function removeValue(guildID, type, value) {
    var guildSetting = get(guildID);
    if (guildSetting[type] instanceof Array) {
        var index = guildSetting[type].indexOf(value);
        console.log(index);
        if (index >= 0)
            guildSetting[type].splice(index, 1);
    }
    guildSettings[guildID] = guildSetting;
    save();
}
function contains(guildID, type, value) {
    var guildSetting = get(guildID);
    if (guildSetting[type] instanceof Array) {
        return guildSetting[type].indexOf(value) >= 0;
    }
    else {
        return guildSetting[type] == value;
    }
}
function save() {
    if (fs.existsSync(guildSettingsPath))
        fs.unlinkSync(guildSettingsPath);
    fs.writeFileSync(guildSettingsPath, JSON.stringify(guildSettings));
}

module.exports = {
    getCmdpref: (guildID) => getValue(guildID, "cmdpref"),
    getTsun: (guildID) => getValue(guildID, "tsun"),
    getDeadList: (guildID) => getValue(guildID, "deadlist"),
    setCmdpref: (guildID, pref) => setValue(guildID, "cmdpref", pref),
    setTsun: (guildID, tsun) => setValue(guildID, "tsun", tsun),
    addDead: (guildID, id) => setValue(guildID, "deadlist", id),
    removeDead: (guildID, id) => removeValue(guildID, "deadlist", id),
    deadContains: (guildID, id) => contains(guildID, "deadlist", id),
    addAdmin: (guildID, id) => setValue(guildID, "admins", id),
    removeAdmin: (guildID, id) => removeValue(guildID, "admins", id),
    hasAdmin: (guildID, id) => contains(guildID, "admins", id),
    admins: (guildID) => get(guildID).admins,
    level: (core, userID, guildID) => {
        if (core.discord.creatorID == userID)
            return 3;
        else if (core.discord.ownerID == userID)
            return 2;
        else if (contains(guildID, "admins", userID))
            return 1;
        else
            return 0;
    }
}