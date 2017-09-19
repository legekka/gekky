// dsettings.js
// discord serverspecified settings

var dsettings = {
    guildSettingsPath: './data/guildSettings.json',
    guildSettings: fs.existsSync(dsettings.guildSettingsPath) ?
        JSON.parse(fs.readFileSync(guildSettingsPath).toString()) :
        fs.writeFileSync(guildSettingsPath, "{}"),
    getCmdpref: (guildID) => dsettings.getValue(guildID, "cmdpref"),
    getTsun: (guildID) => dsettings.getValue(guildID, "tsun"),
    getDeadList: (guildID) => dsettings.getValue(guildID, "deadlist"),
    setCmdpref: (guildID, pref) => dsettings.setValue(guildID, "cmdpref", pref),
    setTsun: (guildID, tsun) => dsettings.setValue(guildID, "tsun", tsun),
    addDead: (guildID, id) => dsettings.setValue(guildID, "deadlist", id),
    removeDead: (guildID, id) => dsettings.removeValue(guildID, "deadlist", id),
    deadContains: (guildID, id) => dsettings.contains(guildID, "deadlist", id),
    addAdmin: (guildID, id) => dsettings.setValue(guildID, "admins", id),
    removeAdmin: (guildID, id) => dsettings.removeValue(guildID, "admins", id),
    hasAdmin: (guildID, id) => dsettings.contains(guildID, "admins", id),
    admins: (guildID) => dsettings.get(guildID).admins,
    level: (core, userID, guildID) => {
        if (core.discord.creatorID == userID)
            return 3;
        else if (core.discord.ownerID == userID)
            return 2;
        else if (dsettings.contains(guildID, "admins", userID))
            return 1;
        else
            return 0;
    },
    get: (guildID) => {
        var guildSetting = dsettings.guildSettings[guildID];
        if (!guildSetting) {
            guildSetting = {
                cmdpref: "!",
                tsun: true,
                deadlist: [],
                admins: []
            };
            dsettings.guildSettings[guildID] = guildSetting;
            dsettings.save();
        }
        return guildSetting;
    },
    getValue: (guildID, type) => {
        return dsettings.get(guildID)[type];
    },
    setValue: (guildID, type, value) => {
        var guildSetting = dsettings.get(guildID);
        if (guildSetting[type] instanceof Array) {
            if (!dsettings.contains(guildID, type, value))
                guildSetting[type].push(value);
        }
        else {
            guildSetting[type] = value;
        }
        dsettings.guildSettings[guildID] = guildSetting;
        dsettings.save();
    },
    removeValue: (guildID, type, value) => {
        var guildSetting = dsettings.get(guildID);
        if (guildSetting[type] instanceof Array) {
            var index = guildSetting[type].indexOf(value);
            console.log(index);
            if (index >= 0)
                guildSetting[type].splice(index, 1);
        }
        dsettings.guildSettings[guildID] = guildSetting;
        dsettings.save();
    },
    contains: (guildID, type, value) => {
        var guildSetting = dsettings.get(guildID);
        if (guildSetting[type] instanceof Array) {
            return guildSetting[type].indexOf(value) >= 0;
        }
        else {
            return guildSetting[type] == value;
        }
    },
    save: () => {
        if (fs.existsSync(guildSettingsPath))
            fs.unlinkSync(guildSettingsPath);
        fs.writeFileSync(guildSettingsPath, JSON.stringify(dsettings.guildSettings));
    }
}