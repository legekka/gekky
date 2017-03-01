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
                "\nSky: " + result[0].current.skytext +
                "\nHumidity: " + result[0].current.humidity + " %" +
                "\nWind Speed: " + result[0].current.windspeed +
                "\nObservation Time: " + result[0].current.observationtime;
            return callback({
                "title": "Weather: " + result[0].location.name,
                "description": desc,
                "thumbnail": {
                    "url": result[0].current.imageUrl
                }
            });
        }
    });
} 