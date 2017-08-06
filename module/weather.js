// weather.js
// weather info

const weather = require('weather-js');
const fs = require('fs');

module.exports = (city, callback) => {
    weather.find({ search: city, degreeType: 'C' }, function (err, result) {
        if (err) {
            err = err.toString().substr(0,2000);
            console.log(err);
            return callback({
                "title": "Error",
                "description": err
            })
        } else {
            var desc = "Hőmérséklet: " + result[0].current.temperature + " °C" +
                "\nÉgbolt: " + translate(result[0].current.skytext) +
                "\nPáratartalom: " + result[0].current.humidity + " %" +
                "\nSzél: " + result[0].current.windspeed +
                "\nUtoljára frissítve: " + result[0].current.observationtime;
            return callback({
                "title": "Időjárás: " + result[0].location.name,
                "description": desc,
                "thumbnail": {
                    "url": result[0].current.imageUrl
                }
            });
        }
    });
} 

function translate(eng){
    switch(eng){
        //Napos
        case "Sunny":
            return "Napos";
        case "Partly Sunny":
            return "Részben napos";
        case "Mostly Sunny":
            return "Többnyire napos";
        //Felhős
        case "Cloudy":
            return "Felhős";
        case "Partly Cloudy":
            return "Részben felhős";
        case "Mostly Cloudy":
            return "Többnyire felhős";
        //Tiszta
        case "Clear":
            return "Derült";
        case "Partly Clear":
            return "Részben derült";
        case "Mostly Clear":
            return "Többnyire derült";
        //Egyéb
        case "Rain":
            return "Esős";
        case "T-Storms":
            return "Zivatarok";
        default:
            fs.appendFileSync('../missing.txt',eng+'\n');
            return eng;
    }
}
