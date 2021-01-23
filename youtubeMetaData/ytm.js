'use strict';
const cheerio = require("cheerio");
const shnet = require("shark-netlib");
function main(youtube) {
    return new Promise(async (ok, erro) => {
        if (/((http|https):\/\/)?(www\.)?(youtube\.com)(\/)?([a-zA-Z0-9\-\.]+)\/?/.test(youtube)) {
            try {
                const body = await shnet(youtube.replace("http:", "https:")),
                    $ = cheerio.load(body),
                    title = $(`meta[name="title"]`).attr("content"),
                    description = $(`meta[name="description"]`).attr("content"),
                    keywords = $(`meta[name="keywords"]`).attr("content"),
                    shortlinkUrl = $(`link[rel="shortlinkUrl"]`).attr("href"),
                    ur = $(`link[type="application/json+oembed"]`).attr("href");
                const embedinfo = ur ? JSON.parse((await shnet(ur.split("http:").join("https:")))) : undefined;
                ok({ title, description, keywords, shortlinkUrl, embedinfo });
            } catch (e) {
                erro({ message: "Error", errorcode: 2, erroca: e });
            }
        } else {
            erro({ message: "Non Valid youtube Link!", errorcode: 1 });
        }
    });
}
module.exports = main;