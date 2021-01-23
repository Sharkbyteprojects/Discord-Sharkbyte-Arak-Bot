#!/usr/bin/env node
//<c>SHARKBYTEPROJECTS
//https://github.com/Sharkbyteprojects/Discord-Sharkbyte-Arak-Bot
console.log("\u001b[31mSharkbyte ARAK Discord Bot BootupService\n\xa9 Sharkbyteprojects");
const { program } = require('commander'),
    package = require("./package.json"),
    fs = require("fs"),
    path = require("path").resolve(__dirname, "settings", "usr.json");
program
    .option('-t, --token <token>', 'Discord bot token - needed for the first start or if token changed', '')
    .option('-l, --tolog <tolog>', 'Set log List (DEVS)', '[]')
    .version(package.version);
program.parse(process.argv);
const options = program.opts();
const token = options.token && options.token != "" ? options.token : "";
let tchange = {token:"", tolog:[]}, newd = [], fileex = fs.existsSync(path);
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
const wo = () => {
    tchange.tolog = newd;
    fs.writeFileSync(path, JSON.stringify(tchange));
}
if (token != "") {
    tchange.botkey = token;
    wo();
    fileex = true;
} else if (tchange.tolog != newd)
    wo();

if (fileex) {
    console.log("Booting up main App\n\u001b[0m");
    require("./app");//SHOUD START APP
} else {
    console.log("OOOPS, TOKEN NOT DEFINED, DEFINE A TOKEN WITH:\n sharkdiscordbot -t \"newtoken\"\n\u001b[0m");
}