'use strict';
const { URL } = require("url");
const http = require("http");
const https = require("https");
function main(link) {
    return new Promise((ok, erro) => {
        const urlofvid = new URL(link);
        try {
            (urlofvid.protocol == 'https:' ? https : http).request(urlofvid, response => {
                let body = '';
                response.on("data", chunk => body += chunk);
                response.on("end", () => {
                    ok(body);
                });
                response.on("error", erro);
            }).end();
        } catch (e) {
            erro(e);
        }
    });
}

module.exports = main;
