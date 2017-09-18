// codeBuilder.js
// memoryleak-free mode

var fs = require('fs');

var modulelist = fs.readdirSync('./module/');


var core = fs.readFileSync('./core.js').toString().split('// [CodeBuilder]');

var modules = [];

for (i in modulelist) {
    var name = modulelist[i].split('.')[0];
    var m = fs.readFileSync(`./module/${modulelist[i]}`).toString()
    m = remreqrel(remreq(m));
    m = `function ${name}() {\r\n${m}\r\n}\r\n`;
    modules.push(m);
}
core[0] = core[0].replace("var reqreload = require('./module/reqreload.js');", "");
core[1] = remreq(core[1]);

var complete = core[0];
var i = 0;
while (i < modules.length) {
    complete += modules[i];
    i++;
}
complete += core[1];

fs.writeFileSync('./complete.js', complete);

function remreq(code) {
    while ((code.indexOf(`reqreload('./`) >= 0 || code.indexOf(`require('./`) >= 0)) {
        for (i in modulelist) {
            while ((code.indexOf(`reqreload('./${modulelist[i]}')`) >= 0 ||
                code.indexOf(`require('./${modulelist[i]}')`) >= 0 ||
                code.indexOf(`reqreload('./module/${modulelist[i]}')`) >= 0 ||
                code.indexOf(`require('./module/${modulelist[i]}')`) >= 0)) {

                if (code.indexOf(`reqreload('./${modulelist[i]}')`) >= 0) {
                    code = code.replace(`reqreload('./${modulelist[i]}')`, `${modulelist[i].split('.')[0]}`)

                } else if (code.indexOf(`require('./${modulelist[i]}')`) >= 0) {
                    code = code.replace(`require('./${modulelist[i]}')`, `${modulelist[i].split('.')[0]}`)

                } else if (code.indexOf(`reqreload('./module/${modulelist[i]}')`) >= 0) {
                    code = code.replace(`reqreload('./module/${modulelist[i]}')`, `${modulelist[i].split('.')[0]}`)

                } else if (code.indexOf(`require('./module/${modulelist[i]}')`) >= 0) {
                    code = code.replace(`require('./module/${modulelist[i]}')`, `${modulelist[i].split('.')[0]}`)

                }
            }
        }
    }
    return code;
}

function remreqrel(code) {
    while (code.indexOf('var reqreload = reqreload()') >= 0 || code.indexOf('const reqreload = reqreload();') >= 0) {
        if (code.indexOf('var reqreload = reqreload()') >= 0) {
            code = code.replace('var reqreload = reqreload()', '');
        } else if (code.indexOf('const reqreload = reqreload();') >= 0) {
            code = code.replace('const reqreload = reqreload();', '');
        }
    }
    return code;
}