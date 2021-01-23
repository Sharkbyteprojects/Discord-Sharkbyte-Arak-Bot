'use strict';
const cheerio = require("cheerio");
const shnet = require("shark-netlib");
function main(youtube) {
    return new Promise(async (ok, erro) => {
        if (/((http|https):\/\/)?(www\.)?(youtube\.com)(\/)?([a-zA-Z0-9\-\.]+)\/?/.test(youtube)) {
            try {
                const body = await shnet(youtube.replace("http:", "https:"));
                const $ = cheerio.load(body);
                const title = $(`meta[name="title"]`).attr("content");
                const description = $(`meta[name="description"]`).attr("content");
                const keywords = $(`meta[name="keywords"]`).attr("content");
                const shortlinkUrl = $(`link[rel="shortlinkUrl"]`).attr("href");
                const embedinfo = JSON.parse(await shnet($(`link[type="application/json+oembed"]`).attr("href").replace("http:", "https:")));
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