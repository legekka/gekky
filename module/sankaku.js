// sankaku.js
// sankaku and nhentai search engine

const reqreload = require('./reqreload.js');
const fs = require('fs');
const http = require('https');
const c = require('chalk');

var path = '../cache/';

// --- nhentai part ----

// https get file
var done = false;

function httpGet(url, filename) {
    var downloadedfile = fs.createWriteStream(path + filename);
    done = false;
    var request = http.get(url, function (response) {
        response.pipe(downloadedfile, { end: false });
        response.on('end', () => {
            done = true;
        });
    });
}

function nsfwFilter(core, message, searchword, mode) {
    if (mode == 'nhentai') {
        if (message.channel.name.indexOf('nsfw') < 0) {
            reqreload('./log.js').consoleLog(core, c.bgRed('Doujin search at wrong channel.'));
            message.channel.sendMessage('retard, itt nem kereshetsz.');
        } else {
            nhentaiSearch(core, message, searchword);

        }
    }
}

module.exports = {
    search: (core, message, searchword, mode) => {
        nsfwFilter(core, message, searchword, mode)
    },
    nhentaiSearch: (core, message, searchword) => {
        var ncounter = message.id;
        var url_link = 'https://nhentai.net/search/?q=';
        while (searchword != searchword.replace(' ', '+')) {
            searchword = searchword.replace(' ', '+');
        }
        while (searchword != searchword.replace('_', '-')) {
            searchword = searchword.replace('_', '-');
        }
        while (searchword != searchword.replace('?', '%3F')) {
            searchword = searchword.replace('?', '%3F');
        }
        url_link = url_link + searchword;
        httpGet(url_link, ncounter + '.html');
        var inta = setInterval(() => {
            if (done) {
                clearInterval(inta);
                if (fs.existsSync(path + ncounter + '.html')) {
                    var input = fs.createReadStream(path + ncounter + '.html');
                    var array = fs.readFileSync(path + ncounter + '.html').toString().split('\n');
                    var no_match = false;
                    var word = '';
                    var i = 0;
                    while (i < array.length && array[i].indexOf('404 – Not Found') < 0) { i++; }
                    if (i < array.length) { no_match = true; }
                    if (!no_match) {
                        var result_count;
                        var i = 0;
                        while (i < array.length && array[i].indexOf('Results') < 0) { i++; }
                        if (i < array.length) {
                            var word = array[i].trim().substr(4, array[i].trim().indexOf(' Result') - 4);
                            while (word != word.replace(',', '')) {
                                word = word.replace(',', '');
                            }
                            result_count = parseInt(word);
                            if (Math.ceil(result_count / 25) > 400) {
                                var page = Math.round(Math.random() * Math.ceil(400) - 1) + 1;
                            } else if (result_count <= 25) {
                                var page = 1;
                            } else {
                                var page = Math.round(Math.random() * Math.ceil(result_count / 25) - 1) + 1;
                            }
                            ncounter += 'b';
                            httpGet(url_link + '&page=' + page, ncounter + '.html');
                            var inte = setInterval(() => {
                                if (done) {
                                    clearInterval(inte);
                                    var doujinlist = [];
                                    var input = fs.createReadStream(path + ncounter + '.html');
                                    var array = fs.readFileSync(path + ncounter + '.html').toString().split('\n');
                                    for (i in array) {
                                        if (array[i].indexOf('<div class="gallery" data-tags=') >= 0) {
                                            var word = array[i].trim().substr(array[i].trim().indexOf('<a href="') + 9);
                                            word = 'https://nhentai.net' + word.substr(0, word.indexOf('"'));
                                            doujinlist.push(word);
                                        }
                                    }
                                    var rnumber = Math.round((Math.random() * (doujinlist.length - 1) + 1));
                                    if (doujinlist[rnumber] != undefined) {
                                        message.channel.sendMessage(doujinlist[rnumber]);
                                        reqreload('./log.js').consoleLog(core, doujinlist[rnumber]);
                                    } else {
                                        message.channel.sendMessage('Nincs találat. ¯\\_(ツ)_/¯');
                                        reqreload('./log.js').consoleLog(core, 'Nincs találat. ¯\\_(ツ)_/¯');
                                    }
                                }
                            }, 100);
                        }
                    } else {
                        message.channel.sendMessage('Nincs találat. ¯\\_(ツ)_/¯');
                        reqreload('./log.js').consoleLog(core, 'Nincs találat. ¯\\_(ツ)_/¯');
                    }
                } else {
                    message.channel.sendMessage('Nincs találat. ¯\\_(ツ)_/¯');
                    reqreload('./log.js').consoleLog(core, 'Nincs találat. ¯\\_(ツ)_/¯');
                }
            }
        }, 100);
    }
}