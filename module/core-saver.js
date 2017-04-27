// core-saver.js
// saving core variable to the disk for the Yrexia server

var fs = require('fs');

var path = '../Yrexia/core.json';

module.exports = (core) => {
    fs.writeFileSync(path,JSON.stringify(core));
}