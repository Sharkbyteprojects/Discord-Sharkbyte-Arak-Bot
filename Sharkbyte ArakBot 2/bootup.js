#!/usr/bin/env node
//<c>SHARKBYTEPROJECTS
//https://github.com/Sharkbyteprojects/Discord-Sharkbyte-Arak-Bot
console.log("\u001b[31mSharkbyte ARAK Discord Bot BootupService\n\xa9 Sharkbyteprojects\u001b[0m");
const { program, option } = require('commander'),
    package = require("./package.json"),
    fs = require("fs"),
    { fork } = require("child_process")
ex = require("path"),
    path = ex.resolve(__dirname, "settings", "usr.json");
program
    .option('-t, --token <token>', 'Discord bot token - needed for the first start or if token changed', '')
    .option('-l, --tolog <tolog>', 'Set log List (DEVS)', '[]')
    .option("-ds, --nostore", "Disable File Writing (SETTINGS AND LOG, THE SETTING \"--tolog\" will ignored!)")
    .version(package.version);
program.parse(process.argv);
console.log("\u001b[31m");
const options = program.opts()
token = options.token && options.token != "" ? options.token : "";
if (options.nostore) console.log("WriteFile disabled");
let tchange = { token: "", tolog: [] }, newd = [], fileex = fs.existsSync(path);
if (fileex) {
    try {
        tchange = JSON.parse(fs.readFileSync(path).toString("utf-8"));
    } catch (e) { }
}
try {
    newd = JSON.parse(options.tolog);
} catch (r) {
    console.log("TOLOG: No Valid data, fallback to []");
    newd = [];
}
function addtoken(wo) {
    if (token != "") {
        tchange.botkey = token;
        wo();
        fileex = true;
    } else if (tchange.tolog != newd)
        wo();
}

if (!options.nostore) {
    try {
        const wo = () => {
            tchange.tolog = newd;
            try {
                fs.mkdirSync(require("path").resolve(__dirname, "settings"));
            } catch (e) { }
            fs.writeFileSync(path, JSON.stringify(tchange));
        }
        addtoken(wo);
    } catch (e) {
        console.log(`File-Error:${e}`);
    }
} else {
    function excb() {
        tchange.tolog = [];
    }
    addtoken(excb);
}

if (fileex || tchange.botkey) {
    console.log("Booting up main App\n\u001b[0m");
    //require("./app");//SHOUD START APP:
    const mainapp=fork(ex.resolve(__dirname, "app.js"), [], { env: { "DiscordBotSettings": JSON.stringify(tchange) } });
} else {
    console.log("OOOPS, TOKEN NOT DEFINED, DEFINE A TOKEN WITH:\n sharkdiscordbot -t \"newtoken\"\n");
}