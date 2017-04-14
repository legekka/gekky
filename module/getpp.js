const exec = require("child_process").exec;
const request = require("request");
const fs = require("fs");



module.exports = (beatmapID, accuracy, combo, misses, mods, callback) => {
    getBeatmap(beatmapID, (osuFile) => {
        // EZT sűrgősen multiplatformmá tenni!!
        var oppai = exec(`./oppai.sh ${osuFile} ${accuracy} +${getOppaiMods(mods)} ${combo}x ${misses}m`, (error, stdout, stderr) => {
            if (stdout.toString().indexOf("pp") >= 0) {
                stdout.toString().split("\r\n").forEach(t => {
                    if (t.indexOf("pp") >= 0 && t.indexOf("acc pp bonus") < 0) {
                        return callback(t.substring(0, t.length - 2));
                        oppai.kill();
                    }
                });
            }
        });
    });
};

function getBeatmap(beatmapID, callback) {
    var filePath = "../cache/" + beatmapID + ".osu";
    fs.exists(filePath, (exists) => {
        if (exists) {
            fs.unlink(filePath, (err) => {
                downloadMap(beatmapID, (filePath) => {
                    return callback(filePath);
                });
            });
        }
        else {
            downloadMap(beatmapID, (filePath) => {
                return callback(filePath);
            });
        }
    });
}
function downloadMap(beatmapID, callback) {
    var filePath = "../cache/" + beatmapID + ".osu";
    var osuRequest = request("https://osu.ppy.sh/osu/" + beatmapID);

    var stream = fs.createWriteStream(filePath);
    osuRequest.on("response", (resp) => {
        resp.pipe(stream);
    });
    osuRequest.on("complete", (resp, body) => {
        resp.pipe(stream);
        resp.on("end", () => {
            stream.close();
        });
    });
    stream.on("close", () => {
        return callback(filePath);
    });
}
function getOppaiMods(mods) {
    var oppaiMods = mods.toLowerCase().trim();
    while ((oppaiMods = oppaiMods.replace("+", "")).indexOf(" + ") >= 0) {
        oppaiMods = oppaiMods.replace("+", "");
    }
    return oppaiMods;
}
