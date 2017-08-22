var fs = require('fs');
var settingsPath = './data/anyád.json';
if (!fs.existsSync(settingsPath))
    fs.writeFileSync(settingsPath, "{}");
//var settings = require(settingsPath); // ennek mennie kellene...
var settings;

if (fs.existsSync(settingsPath)){
    settings = JSON.parse(fs.readFileSync(settingsPath).toString());
}

function get(guildID){
    var setting = settings[guildID];
    if (!setting){
        setting = {
            cmdpref: "!",
            tsun: true,
            deadlist: []
        };
        settings[guildID] = setting;
        save();
    }
    return settings[guildID];
}
function getValue(guildID, type){
    return get(guildID)[type];
}
function setValue(guildID, type, value){
    var setting = get(guildID);
    if(setting[type] instanceof Array){
        if (!contains(guildID, type, value))
            setting[type].push(value);
    }
    else{
        setting[type] = value;
    }
    settings[guildID] = setting;
    save();
}
function removeValue(guildID, type, value){
    var setting = get(guildID);
    if(setting[type] instanceof Array){
        var index = setting[type].indexOf(value);
        if (index >= 0)
            setting[type] = setting[type].splice(index, 1);
    }
    settings[guildID] = setting;
    save();
}
function contains(guildID, type, value){
    var setting = settings[guildID];
    if(setting[type] instanceof Array){
        return setting[type].indexOf(value) >= 0;
    }
    else{
        return setting[type] == value;
    }
}
function save(){
    if (fs.existsSync(settingsPath))
        fs.unlinkSync(settingsPath);
    fs.writeFileSync(settingsPath, JSON.stringify(settings));
}

module.exports = {
    getCmdpref: (guildID) => getValue(guildID, "cmdpref"),
    getTsun: (guildID) => getValue(guildID, "tsun"),
    getDeadList: (guildID) => getValue(guildID, "deadlist"),
    setCmdpref: (guildID, pref) => setValue(guildID, "cmdpref", pref),
    setTsun: (guildID, tsun) => setValue(guildID, "tsun", tsun),
    addDead: (guildID, name) => setValue(guildID, "deadlist", name),
    removeDead: (guildID, name) => removeValue(guildID, "deadlist", name),
    deadContains: (guildID, name) => contains(guildID, "deadlist", name)
}