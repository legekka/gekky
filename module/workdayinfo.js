// workdayinfo.js
// workday informations

const fs = require('fs');

var path = '../data/workdays.txt';

module.exports = (callback) => {
    var da = new Date();
    input = fs.createReadStream(path);
    text = fs.readFileSync(path).toString().split('\n');
    var kezd;
    var bef;
    var szabad = false;
    var megvan = false;
    for (i in text) {
        var datum = text[i].split(',')[0].trim();
        var dadatum = da.getFullYear() + '.' + (da.getMonth() + 1) + '.' + da.getDate();
        if (dadatum == datum) {
            megvan = true;
            if (text[i].split(',')[1] == "free") {
                szabad = true;
            } else {
                kezd = parseInt(text[i].split(',')[1].split('-')[0]);
                bef = parseInt(text[i].split(',')[1].split('-')[1]);
            }
        }
    }
    var str = '';
    var color = "505050";
    if (megvan) {
        if (szabad) {
            str = "Ma nem dolgozol, remélem örülsz.\nÉn nem.";
            color = "9cff01";
        } else {
            str = "Ma " + kezd + " órától " + bef + " óráig dolgozol.\n"
            if (napora(kezd, bef) <= 6) {
                str += "Egy rövidke " + napora(kezd, bef) + " órácskás műszak.";
                color = "01ff07";
            } else if (napora(kezd, bef) <= 8) {
                str += "Normál " + napora(kezd, bef) + " órás műszak.";
                color = "f6ff00";
            } else {
                str += napora(kezd, bef) + " óra??? Te beteg vagy. Kitartást.";
                color = "ff0000";
            }

            var ind = kezd - 2;
            var hatra_perc;
            var hatra_ora;
            if (29 - da.getMinutes() < 0) {
                hatra_perc = 29 - da.getMinutes() + 60;
                hatra_ora = -1;
            } else {
                hatra_perc = 29 - da.getMinutes();
                hatra_ora = 0;
            }
            if (ind - da.getHours() < 0) {
                hatra_ora += ind - da.getHours() + 24;
            } else {
                hatra_ora += ind - da.getHours();
            }
            if (hatra_ora > 0) {
                str += "\nIndulásig még van hátra **" + hatra_ora + " óra " + hatra_perc + "perc**ed.";
            } else {
                str += "\nIndulásig már csak **" + hatra_perc + "perc**ed van hátra."
            }
        }
    } else {
        str = "A mai napra nincs infóm a munkaidőddel kapcsolatban.\nRemélem neked azért van."
    }
    return callback({
        "title": "Munkanap Info",
        "description": str,
        "color": parseInt(color, 16)
    });
}