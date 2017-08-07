// sankaku.js
// sankaku and nhentai search engine

const reqreload = require('./reqreload.js');
const fs = require('fs');
const http = require('https');
const c = require('chalk');
const exec = require('child_process').exec;

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

function ratingColor(rating) {
    switch (rating) {
        case 'safe':
            return parseInt('7aef34', 16);
            break;
        case 'explicit':
            return parseInt('fa2525', 16);
            break;
        case 'questionable':
            return parseInt('f4ee3d', 16);
            break;
        default:
            return parseInt('ff761d', 16);
            break;
    }
}

function nsfwFilter(core, message, searchword, mode) {
    if (mode == 'nhentai') {
        if (message.channel.name.indexOf('nsfw') < 0) {
            reqreload('./log.js').consoleLog(core, c.bgRed('Doujin search at wrong channel.'));
            message.channel.send('retard, itt nem kereshetsz.');
        } else {
            nhentaiSearch(core, message, searchword);
        }
    } else if (mode == 'sankaku') {
        if (message.channel.name.indexOf('nsfw') < 0) {
            reqreload('./log.js').consoleLog(core, c.bgRed('Sankaku search at wrong channel.'));
            message.channel.send('retard, itt nem kereshetsz.');
        } else {
            sankakuSearch(core, message, searchword, () => {});
        }
    }
}

function sankakuSearch(core, message, searchword, callback) {
    var ncounter = message.id;
    var url_link = 'https://chan.sankakucomplex.com/?tags=';
    while (searchword != searchword.replace(' ', '+')) {
        searchword = searchword.replace(' ', '+');
    }
    url_link = url_link + searchword;

    if (url_link.indexOf('order:') < 0) {
        url_link += '+order:random';
    }
    message.fname1 = ncounter + '.html';
    var curl = exec(`curl -s -b ${path}cookies.txt "${url_link}" > "${path}${message.fname1}"`, (err, stdout, stderr) => {
        if (err) {
            console.log(err);
            message.channel.send('Ajjaj... valami nem jó... (search-html)');
            return callback();
        }
    });
    curl.on('exit', (code) => {
        if (!fs.existsSync(path + message.fname1)) {
            console.log('File has been not downloaded.1');
            message.channel.send('Valamiért nem jött le a html~');
            return callback();
        }
        var text = fs.readFileSync(path + message.fname1).toString().split('\n');
        var postlist = [];
        for (i in text) {
            if (text[i].indexOf("thumb blacklisted") >= 0) {
                var str = text[i].substr(text[i].indexOf("thumb blacklisted"));
                str = str.substr(str.indexOf('p'));
                str = str.substr(1, str.indexOf('>') - 1);
                postlist.push(str);
            }
        }
        if (postlist.length == 0) {
            message.channel.send('Nincs találat. https://cs.sankakucomplex.com/data/3d/0e/3d0e02f9ebd984d7af5891f693e82f6f.jpg');
        } else if (postlist.length > 4) {
            postlist.splice(0, 4);
        }
        random = Math.round(Math.random() * postlist.length) - 1;
        var post_url = 'https://chan.sankakucomplex.com/post/show/' + postlist[random];
        message.fname2 = postlist[random] + '.html';
        var curl2 = exec(`curl -s -b ${path}cookies.txt "${post_url}" > "${path}${message.fname2}"`, (err, stdout, stderr) => {
            if (err) {
                console.log(err);
                message.channel.send('Ajjaj... valami nem jó... (post-html)');
                return callback();
            }
        });
        curl2.on('exit', (code) => {
            if (!fs.existsSync(path + message.fname2)) {
                console.log('File has been not downloaded.2');
                message.channel.send('Valamiért nem jött le a html~');
                return callback();
            }
            var text = fs.readFileSync(path + message.fname2).toString().split('\n');

            var original_url = '';
            var rating = '';
            var ind = -1;
            for (j = 0; j < text.length; j++) {
                if (text[j].indexOf("<li>Rating: ") >= 0) {
                    ind = j;
                }
            }
            if (ind != -1) {
                rating = text[ind].substr(text[ind].indexOf(' '));
                rating = rating.substr(0, rating.indexOf('<')).trim().toLowerCase();
            } else {
                console.log("FUCK.");
                message.channel.send('FUCK.');
                return callback();
            }
            var i = 0;
            while (i < text.length && text[i].indexOf("Original:") < 0) { i++ }
            if (i < text.length) {
                original_url = text[i].trim().substr(text[i].indexOf('/'));
                original_url = "https:" + original_url.substr(0, original_url.indexOf('?'));
            } else {
                console.log("Kurwa.");
                message.channel.send('Kurwa.');
                return callback();
            }
            var ext = original_url.substr(original_url.length - 3, 3);
            if (ext != 'jpg' && ext != 'png') {
                console.log('Ez... Nem kép.');
                message.channel.send('Ez... Nem kép. Nem kell.');
            }
            message.fname3 = postlist[random] + '.' + ext;
            var curl3 = exec(`curl -s -b ${path}cookies.txt "${original_url}" > "${path}${message.fname3}"`, (err, stdout, stderr) => {
                if (err) {
                    console.log(err);
                    message.channel.send('Ajjaj... valami nem jó... (post-image)');
                    return callback();
                }
            });
            var teszt = false;
            curl3.on('exit', (code) => {
                if (!fs.existsSync(path + message.fname3)) {
                    console.log('File has been not downloaded.');
                    message.channel.send('Valamiért nem jött le a kép~');
                    return callback();
                }
                if (!teszt) {
                    teszt = true;
                    reqreload('./webpconvert.js').file(path + message.fname3, (image) => {
                        console.log(image);
                        core.bot.channels.get(core.ch.gekkylog).send({files:[image]}).then(response => {
                            message.channel.send({embed:{
                                "title": "Full size",
                                "description": "Post ID: " + postlist[random] + "\nPost Link: " + post_url,
                                "image": {
                                    "url": response.attachments.first().url
                                },
                                "url": original_url,
                                "color": ratingColor(rating)
                            }});
                        });
                    });
                }
            });

        });
    });
}



function nhentaiSearch(core, message, searchword) {
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
                                    message.channel.send(doujinlist[rnumber]);
                                    reqreload('./log.js').consoleLog(core, doujinlist[rnumber]);
                                } else {
                                    message.channel.send('Nincs találat. ¯\\_(ツ)_/¯');
                                    reqreload('./log.js').consoleLog(core, 'Nincs találat. ¯\\_(ツ)_/¯');
                                }
                            }
                        }, 100);
                    }
                } else {
                    message.channel.send('Nincs találat. ¯\\_(ツ)_/¯');
                    reqreload('./log.js').consoleLog(core, 'Nincs találat. ¯\\_(ツ)_/¯');
                }
            } else {
                message.channel.send('Nincs találat. ¯\\_(ツ)_/¯');
                reqreload('./log.js').consoleLog(core, 'Nincs találat. ¯\\_(ツ)_/¯');
            }
        }
    }, 100);
}


module.exports = {
    search: (core, message, searchword, mode) => {
        nsfwFilter(core, message, searchword, mode)
    }
}
