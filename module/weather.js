// weather.js
// weather info

const weather = require('weather-js');

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
            var desc = "Temperature: " + result[0].current.temperature + " °C" +
                "\nÉgbolt: " + result[0].current.skytext +
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
