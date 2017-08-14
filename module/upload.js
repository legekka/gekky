var request = require('request');
var fs = require('fs');
var exec = require('child_process').exec;

var api_key = fs.readFileSync('../apikey.txt').toString().trim();

module.exports = {
    upload: (path, callback) => {
        if (fs.existsSync(path)) {
            var req = request("https://s-ul.eu/upload.php", {
                method: "POST",
                formData: {
                    "Name": "s-ul",
                    "RequestType": "POST",
                    "FileFormName": "file",
                    "wizard": "true",
                    "file": fs.createReadStream(path),
                    "key": api_key,
                    "gen": "3.2",
                    "ResponseType": "Text",
                    "RegexList": [
                        "\"protocol\":\"(.+?)\"",
                        "\"domain\":\"(.+?)\"",
                        "\"filename\":\"(.+?)\"",
                        "\"extension\":\"(.+?)\""
                    ],
                    "URL": "$1,1$$2,1$/$3,1$$4,1$",
                    "ThumbnailURL": "",
                    "DeletionURL": "https://s-ul.eu/delete.php?key=" + api_key + "&file=$3,1$"
                }
            }, function (err, resp, body) {
                if (err) {
                    console.log('Error!');
                    console.log(err);
                } else {
                    var body = JSON.parse(body);
                    var link = body.protocol + body.domain + '/' + body.filename + body.extension;
                    //console.log('URL: ' + link);
                    return callback(link);
                }
            });
        } else {
            console.log('Error: File not found');
        }
    }
}