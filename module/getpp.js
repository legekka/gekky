// getpp.js
// get pp for osu play


var getpp = {
    getpp: (beatmapID, accuracy, combo, misses, mods, callback) => {
        getpp.getBeatmap(beatmapID, (osuFile) => {
            if (os.platform == "linux") {
                var cmd = "./oppai.sh";
            } else {
                var cmd = "oppai.exe";
            }
            var oppai = exec(`${cmd} ${osuFile} ${accuracy} +${getpp.getOppaiMods(mods)} ${combo} ${misses}m`, (error, stdout, stderr) => {
                if (error) {
                    //console.log(error);
                    return callback("###");
                }
                if (stdout.toString().indexOf("pp") >= 0) {
                    stdout.toString().split("\n").forEach(t => {
                        if (t.indexOf("pp") >= 0 && t.indexOf("acc pp bonus") < 0) {
                            return callback(parseFloat(t.substring(0, t.length - 2)).toFixed(1));
                            oppai.kill();
                        }
                    });
                }

            });
        });
    },
    getBeatmap: (beatmapID, callback) => {
        var filePath = "../cache/" + beatmapID + ".osu";
        fs.exists(filePath, (exists) => {
            if (exists) {
                fs.unlink(filePath, (err) => {
                    getpp.downloadMap(beatmapID, (filePath) => {
                        return callback(filePath);
                    });
                });
            }
            else {
                getpp.downloadMap(beatmapID, (filePath) => {
                    return callback(filePath);
                });
            }
        });
    },
    downloadMap: (beatmapID, callback) => {
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
    },
    getOppaiMods: (mods) => {
        var oppaiMods = mods.toLowerCase().trim();
        while ((oppaiMods = oppaiMods.replace("+", "")).indexOf("+") >= 0) {
            oppaiMods = oppaiMods.replace("+", "");
        }
        return oppaiMods;
    }
}