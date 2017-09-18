// reqreload.js
// require cache reloader shortifier

//var decache = require('decache');

module.exports = (modulename) => {
    delete require.cache[require.resolve(modulename)];
    //decache(modulename);
    return require(modulename);
}