// playcard.js
// score/playcard for osutrack.js

var playcard = {
    playcard: (playcard, filePath) => {
        return new Promise((resolve, reject) => {
            jimp.read(playcard.randombg(), (err, background) => {
                var Image = background;
                jimp.read(playcard.player.avatar, (error, avatar) => {
                    var avatarPrint = avatar.resize(100, 100);
                    playcard.WriteImage(Image, avatarPrint, 10, 5);
                    jimp.read(playcard.map.background, (err2, mapImage) => {
                        playcard.WriteImage(Image, mapImage, 436, 123);
                        jimp.loadFont('./data/fonts/30/font.fnt', (error2, font30) => {
                            Image = background.print(font30, 118, 6, playcard.player.username);
                            jimp.loadFont('./data/fonts/25/font.fnt', (err3, font25) => {
                                var Name = playcard.map.title.length > 39 ? playcard.map.title.substring(0, 35) + '...' : playcard.map.title;
                                Image = background.print(font25, 8, 137, Name);
                                jimp.loadFont('./data/fonts/20/font.fnt', (error3, font20) => {
                                    Image = background.print(font20, 118, 41, playcard.player.global_rank + ' | ' + playcard.player.country_rank + ' | ' + playcard.player.allpp);
                                    Image = background.print(font20, 120, 89, playcard.play.rank + ' | ' + playcard.play.score + ' | ' + playcard.play.combo + ' | ' + playcard.play.acc + ' | ' + playcard.play.mods);
                                    Image = background.print(font20, 8, 165, playcard.map.diff);
                                    Image = background.print(font20, 8, 196, playcard.map.length + ' | ' + playcard.map.bpm + ' | ' + playcard.map.sdiff + ' | ' + playcard.map.maxcombo);
                                    jimp.loadFont('./data/fonts/35/font.fnt', (err4, font35) => {
                                        Image = background.print(font35, 475, 82, playcard.play.pp);
                                        jimp.loadFont('./data/fonts/15/font.fnt', (error4, font15) => {
                                            Image = background.print(font15, 8, 226, playcard.map.cs + ' | ' + playcard.map.ar + ' | ' + playcard.map.od + ' | ' + playcard.map.hp);
                                            var stream = fs.createWriteStream(filePath);
                                            Image.getBuffer(jimp.MIME_PNG, (err5, buffer) => {
                                                stream.write(buffer);
                                                stream.end();
                                                resolve(true);
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    },
    WriteImage: (backgroundImage, ImageToPrint, x, y) => {
        for (var i = 0; i < ImageToPrint.bitmap.width; i++) {
            for (var j = 0; j < ImageToPrint.bitmap.height; j++) {
                try {
                    var originalColor = ImageToPrint.getPixelColor(i, j);
                    backgroundImage.setPixelColor(originalColor, x + i, y + j);
                }
                catch (err) {
                    //console.log(`Error while reading ${i} - ${j} pixels!`);
                }
            }
        }
    },
    randombg: () => {
        var files = fs.readdirSync('./data/playcardbgs/');
        var number = Math.round(Math.random() * (files.length - 1)).toString();
        return './data/playcardbgs/playcard-' + number + '.png';
    }
}