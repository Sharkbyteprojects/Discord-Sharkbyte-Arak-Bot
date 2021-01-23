#!/usr/bin/env node
'use strict';
console.log("Sharkbyte ARAK Discord Bot\n\xa9 Sharkbyteprojects");
var userplayer = [],
    sessionsofyt2discord = [];
const { botkey, tolog } = require("./settings/usr.json"),
    status = ['available', 'idle', 'dnd', 'invisible'],
    Discord = require('discord.js'),
    client = new Discord.Client(),
    fs = require("./appfiles/ftool"),
    tr = require("./appfiles/trcatch"),
    ytdl = require('ytdl-core');/*,
    stop = async () => {
        try {
            await client.user.setStatus(status[2]);
        } catch (e) {
            console.log("Can't set Status");
        }
        console.log("Exit");
        process.exit(0);
    };*/
console.log(`Logmode: ${JSON.stringify(tolog)}`);
const { ymd } = fs,
    logger = new fs.logx(fs.path.resolve(__dirname, "log", "mainlogfile.log"), tolog ? tolog : []),//POSSIBLE IN TO LOG ["ERR", "WARN", "INFO"]; []=nolog
    things = { sstne: "Something stored doesn't exist, but that's not a Problem", fields: require("./appfiles/names_nochange.json"), help: require("./appfiles/help.json"), dtypedecode: ["string", "[[string]]"], dtd: ["string", "object"], headasset: "https://github.com/fire-engine-icons/img-host/raw/master/hfws_hsm_emote.png" };
function errorm(e) {
    client.user.setStatus(status[2]);
    console.error(e);
}

const stats = () => {
    const booool = userplayer.length > 0;
    client.user.setActivity(`${booool ? `Musicsessions: ${userplayer.length} | ` : ""}-help`, { type: booool ? "PLAYING" : "WATCHING" });
};
function xwrite(x) {
    logger.emit("info", x);
    console.log(x);
}
function nmbed(strin, g) {
    let embed = new Discord.MessageEmbed()
        .setTitle(g)
        .setColor(0xff0000)
        .setAuthor(client.user.username, client.user.avatarURL())
        .setDescription(strin)
        .setFooter("\xa9 Sharkbyteprojects");
    return embed;
}

client.on('ready', tr(() => {
    /*process.stdin.resume();
    process.on("SIGINT", stop);*/
    xwrite(`Logged in as ${client.user.tag}!`);
    client.user.setStatus(status[0]);
    stats();
    setInterval(stats, 1000 * 2);
}, errorm));
const embedFooterString = "${usr} sended this message";
client.on('message', async msg => {
    logger.emit("info", `${msg.author.username}(${msg.author.tag}) ${msg.author.bot ? "Bot" : ""} typed "${msg.content}" in the server "${msg.guild && msg.guild.available ? msg.guild.name : "privatechat"}" on the channel ${msg.channel.name}`);
    if (msg.author.bot) { return; }
    const splcon = msg.content.split(" ");
    switch (splcon[0].toLowerCase()) {
        case ("-embed"): {
            //EMBED
            if (msg.deletable) msg.delete({ timeout: 5 });
            let modscan = splcon;
            modscan.shift();
            const xxxx = modscan.join(" ");
            if (splcon.length >= 2) {
                var outp = {};
                try {
                    outp = JSON.parse(xxxx);
                } catch (e) {
                    msg.reply(nmbed(`I thing you have a Typing: \`${Discord.Util.escapeMarkdown(xxxx)}\``, ":warning: embed"));
                    logger.emit("warn", `Error in -embed, first catch block: ${JSON.stringify(e)} emitted by user ${msg.author.tag}`);
                    return;
                }
                let embedcreator = new Discord.MessageEmbed().setAuthor(msg.author.tag, msg.author.avatarURL());
                var mdl = {};
                for (let ef of things.fields) {
                    var citem = outp[ef.n];
                    if (typeof (citem) != things.dtd[ef.dt]) {
                        citem = ef.ev;
                    }
                    mdl[ef.n] = citem;
                }
                const sw = () => { msg.reply(nmbed("You had made something wrong!", ":warning: embed")); };
                if (mdl.image != "") {
                    embedcreator.setThumbnail(mdl.image);
                }
                try {
                    for (let er of Object.entries(mdl.fields)) {
                        embedcreator.addField(er[0], er[1]);
                    }
                } catch (e) {
                    sw();
                }
                var hexnum = 0x3366ff;
                try {
                    hexnum = parseInt(`0x${mdl.color}`);
                } catch (er) {
                    logger.emit("warn", `Error in -embed, int parse catch block: ${JSON.stringify(er)} emitted by user ${msg.author.tag}`);
                    sw();
                }
                embedcreator
                    .setDescription(mdl.description)
                    .setColor(hexnum)
                    .setTitle(mdl.title)
                    .setFooter(embedFooterString.replace("${usr}", msg.author.username));
                msg.channel.send(embedcreator);
                xwrite(`User "${msg.author.tag}" created a -embed`);
            }
            else {
                let embedcreator = new Discord.MessageEmbed()
                    .setAuthor(client.user.tag, client.user.avatarURL())
                    .setColor(0xff0000)
                    .setTitle("Help to Module -embed")
                    .setDescription("Json Value list")
                    .setFooter("\xa9 Sharkbyteprojects");
                for (let e of things.fields) {
                    embedcreator.addField(e.n, `${e.desc} | Datatype: ${things.dtypedecode[e.dt]}`);
                }
                msg.reply(embedcreator);
            } break;
        }
        case ("-help"): {
            //HELP
            if (msg.deletable) msg.delete({ timeout: 5 });
            var cc = "help";
            if (splcon.length >= 2) {
                if (Object.keys(things.help).includes(splcon[1].toLowerCase())) {
                    cc = splcon[1].toLowerCase();
                }
            }
            let embed = new Discord.MessageEmbed()
                .setTitle(':question: Sharkbyte ARAK Help')
                .setColor(0x0033cc)
                .setAuthor(client.user.tag, client.user.avatarURL())
                .setDescription(things.help[cc].desc)
                .setFooter("\xa9 Sharkbyteprojects");
            if (things.help[cc].imup) {
                const pathoffile = fs.path.resolve(__dirname, "appfiles", "assets", things.help[cc].imup);/*"imup": "helpicon.webp",*/
                /*"img": "attachment://helpicon.webp"*/
                if (await fs.exists(pathoffile)) {
                    embed.attachFiles([pathoffile]);
                }
            }
            if (things.help[cc].img) {
                embed.setThumbnail(things.help[cc].img);
            }
            for (let e of Object.entries(things.help[cc].field)) {
                embed.addField(...e);
            }
            msg.reply(embed);
            break;
        }
        case ("-admin"): {
            if (msg.deletable) msg.delete({ timeout: 5 });
            const guild = msg.guild;
            if (guild == null || !guild.available) {
                msg.reply(nmbed(`Failue, you running not on a GUILD\nCurrent Bot Logmode: \`\`\`json\n${JSON.stringify(tolog)}\`\`\``, ':warning: :gear: Server Management - Admin'));
                return;
            }
            msg.guild.members.fetch(msg.guild.ownerID)
                .then(guildMember => {
                    msg.reply(nmbed(`The admin is ${guild.member(guildMember) ? guildMember.toString() : guild.owner.user.tag}\nCurrent Bot Logmode: \`\`\`json\n${JSON.stringify(tolog)}\`\`\``, ':gear: Server Management - Admin'));
                }); break;
        }
        case ("-usrlist"): {
            if (msg.deletable) msg.delete({ timeout: 5 });
            const guild = msg.guild;
            if (guild == null || !guild.available) {
                msg.reply(nmbed(`Failue, you running not on a GUILD`, ':warning: Server List Tool'));
                return;
            }
            let cc = nmbed("A List of all User", 'Server List Tool');
            for (let c of msg.guild.members.cache.array()) {
                cc.addField(c.user.username, `${c.user.tag}${c.user.bot ? "\x40bot" : ""}`);
            }
            msg.reply(cc);
            break;
        }
        case ("-whois"): {
            if (msg.deletable) msg.delete({ timeout: 5 });
            const guild = msg.guild;
            if (guild == null || !guild.available) {
                try {
                    const xr = await msg.reply(nmbed(`Failue, can't Fetch GUILD`, ':warning: Whois'));
                    setTimeout(() => {
                        if (xr.deletable) xr.delete({ timeout: 5 });
                    }, 4000);
                } catch (e) {
                    logger.emit("warn", `Error in -whois, first catch block: ${JSON.stringify(e)} emitted by user ${msg.author.tag}`);
                }
                return;
            }
            const user = msg.mentions.users.first();
            if (user) {
                let ui = nmbed(`Infos about ${Discord.Util.escapeMarkdown(user.username)}`, 'Whois')
                    .setThumbnail(user.avatarURL())
                    .addField("Tag", Discord.Util.escapeMarkdown(user.tag))
                    .addField("Bot", user.bot ? "Yes" : "No")
                    .addField("Flags", Discord.Util.escapeMarkdown(JSON.stringify(user.flags.toArray())))
                    .addField("Account created at", Discord.Util.escapeMarkdown(user.createdAt.toUTCString()))
                    .addField("Link to Image", Discord.Util.escapeMarkdown(user.avatarURL()));
                msg.reply(ui);
                try {
                    const av = msg.guild != null ? msg.guild.available : false;
                    await user.send(nmbed('You where `-whois`', ":question:  WHOIS Information").addField(":service_dog: Server", av ? msg.guild.name : "No server Information available").addField("by", msg.author.username).addField("Tag of User", msg.author.tag).setAuthor(msg.author.tag, msg.author.avatarURL()).setThumbnail(av ? msg.guild.iconURL() : msg.author.avatarURL()));
                } catch (nulls) {
                    logger.emit("warn", `Error in -whois, second catch block: ${JSON.stringify(nulls)} emitted by user ${msg.author.tag}`);
                }
            } else {
                try {
                    const xr = await msg.reply(nmbed(`No User mentioned`, 'Whois'));
                    setTimeout(() => {
                        if (xr.deletable) xr.delete({ timeout: 5 });
                    }, 4000);
                } catch (e) {
                    logger.emit("warn", `Error in -whois, third catch block: ${JSON.stringify(e)} emitted by user ${msg.author.tag}`);
                }
            }
            break;
        }
        case ("-p"):
        case ("-play"): {
            if (msg.deletable) msg.delete({ timeout: 5 });
            if (!msg.guild) {
                msg.reply(nmbed(`Failue, you running not on a GUILD`, ':warning: VoiceChannel').setThumbnail(things.headasset).setColor(0x66ff66));
                return;
            }
            const inx = userplayer.findIndex((cit) => cit.master == msg.author.id);
            if (inx >= 0) {
                const dis = userplayer[inx].dis;
                userplayer.splice(inx, 1);
                try {
                    if (dis) {
                        (await dis.destroy());
                    }
                } catch (e) {
                    logger.emit("warn", `Error in -play, first catch block: ${JSON.stringify(e)} emitted by user ${msg.author.tag}`);
                    console.warn(things.sstne);
                }
            }
            // Only try to join the sender's voice channel if they are in one themselves
            if (msg.member.voice.channel) {
                if (splcon.length >= 2) {
                    if (/((http|https):\/\/)?(www\.)?(youtube\.com)(\/)?([a-zA-Z0-9\-\.]+)\/?/.test(splcon[1]) && ytdl.validateURL(splcon[1])) {
                        try {
                            let title = "", shortlinkUrl = "";
                            try {
                                const md = await ymd(splcon[1]);
                                title = Discord.Util.escapeMarkdown(md.title);
                                shortlinkUrl = md.shortlinkUrl;
                            } catch (e) {
                                logger.emit("warn", `Error in -play, second catch block: ${JSON.stringify(e)} emitted by user ${msg.author.tag}`);
                            }
                            const connection = await msg.member.voice.channel.join();
                            const dispatcher = connection.play(ytdl(splcon[1], { filter: 'audioonly' }));
                            const cc = userplayer.push({ dis: dispatcher, c: msg.member.voice.channel, master: msg.author.id, nplay: (title == "" ? `${Discord.Util.escapeMarkdown(splcon[1])}` : shortlinkUrl == "" ? `${title}` : `[${title}](${shortlinkUrl})`) }) - 1;
                            dispatcher.on("start", async () => {
                                try {
                                    const msgs = (await msg.reply(nmbed(`Start Playing ${title == "" ? `\`${Discord.Util.escapeMarkdown(splcon[1])}\`` : shortlinkUrl == "" ? `${title}` : `[${title}](${shortlinkUrl})`}`, ':headphones:  VoiceChannel').setColor(0x66ff66).setThumbnail(things.headasset)));
                                    setTimeout(() => {
                                        if (msgs.deletable) msgs.delete({ timeout: 5 });
                                    }, 10000);
                                } catch (e) {
                                    logger.emit("warn", `Error in -play, third catch block: ${JSON.stringify(e)} emitted by user ${msg.author.tag}`);
                                }
                            });
                            dispatcher.on('finish', async () => {
                                try {
                                    const msgs = (await msg.reply(nmbed(`Finished Playing ${title == "" ? `\`${Discord.Util.escapeMarkdown(splcon[1])}\`` : shortlinkUrl == "" ? `${title}` : `[${title}](${shortlinkUrl})`}`, ':headphones:  VoiceChannel').setColor(0x66ff66).setThumbnail(things.headasset)));
                                    setTimeout(() => {
                                        if (msgs.deletable) msgs.delete({ timeout: 5 });
                                    }, 10000);
                                } catch (e) {
                                    logger.emit("warn", `Error in -play, fourth catch block: ${JSON.stringify(e)} emitted by user ${msg.author.tag}`);
                                }
                                userplayer.splice(cc);
                                msg.member.voice.channel.leave();
                            });
                            dispatcher.on('error', async (xer) => {
                                try {
                                    const msgs = (await msg.reply(nmbed(`An error Occured`, ':warning: VoiceChannel').setColor(0x66ff66).setThumbnail(things.headasset)));
                                    setTimeout(() => {
                                        if (msgs.deletable) msgs.delete({ timeout: 5 });
                                    }, 10000);
                                } catch (e) {
                                    logger.emit("err", `Error in -play, error catch block: ${JSON.stringify(e)} emitted by user ${msg.author.tag}`);
                                }
                                logger.emit("err", `Error in -play, first catch block: ${JSON.stringify(xer)} emitted by user ${msg.author.tag}`);
                                console.error(xer);
                            });
                        } catch (e) {
                            try {
                                logger.emit("warn", `Error in -play, urlerror catch block: ${JSON.stringify(e)} emitted by user ${msg.author.tag}`);
                                const msgs = await msg.reply(nmbed(`The Url doesn't work or\nConnection Timeout to Discord`, ':warning: VoiceChannel').setColor(0x66ff66).setThumbnail(things.headasset));
                                setTimeout(() => {
                                    if (msgs.deletable) msgs.delete({ timeout: 5 });
                                }, 10000);
                            } catch (e) {
                                logger.emit("warn", `Error in -play, urlerror.inner catch block: ${JSON.stringify(e)} emitted by user ${msg.author.tag}`);
                            }
                        }
                    } else {
                        try {
                            const msgs = await msg.reply(nmbed(`The Url doesn't work`, ':warning: VoiceChannel').setColor(0x33ccff).setThumbnail(things.headasset));
                            setTimeout(() => {
                                if (msgs.deletable) msgs.delete({ timeout: 5 });
                            }, 10000);
                        } catch (e) {
                            logger.emit("warn", `Error in -play, urlerror2 catch block: ${JSON.stringify(e)} emitted by user ${msg.author.tag}`);
                        }
                    }
                } else {
                    try {
                        const msgs = await msg.reply(nmbed(`We need a YouTube Video as second arg!`, ':warning: VoiceChannel').setColor(0x66ff66).setThumbnail(things.headasset));
                        setTimeout(() => {
                            if (msgs.deletable) msgs.delete({ timeout: 5 });
                        }, 10000);
                    } catch (e) {
                        logger.emit("warn", `Error in -play, url second arg catch block: ${JSON.stringify(e)} emitted by user ${msg.author.tag}`);
                    }
                }
            } else {
                try {
                    const msgs = await msg.reply(nmbed(`You need to join a voice channel first!`, ':warning: VoiceChannel').setColor(0x66ff66).setThumbnail(things.headasset));
                    setTimeout(() => {
                        if (msgs.deletable) msgs.delete({ timeout: 5 });
                    }, 10000);
                } catch (e) {
                    logger.emit("warn", `Error in -play, joinvoicechannel catch block: ${JSON.stringify(e)} emitted by user ${msg.author.tag}`);
                }
            }
            break;
        }
        case ("-cleanup_player"): {
            if (msg.deletable) msg.delete({ timeout: 5 });
            if (!msg.guild) {
                msg.reply(nmbed(`Failue, you running not on a GUILD`, ':warning: VoiceChannel').setThumbnail(things.headasset));
                return;
            }
            const inx = userplayer.findIndex((cit) => cit.master == msg.author.id);
            if (inx >= 0) {
                const channel = userplayer[inx].c
                const { dis, nplay } = userplayer[inx];
                userplayer.splice(inx, 1);
                try {
                    if (channel) {
                        var fcu = "";
                        if (dis) {
                            await dis.destroy();;
                            fcu = `Stopped \`${nplay}\`\n`;
                        }
                        await channel.leave();;
                        const msgs = await msg.reply(nmbed(`${fcu}Suceedfully Cleanup`, ':white_check_mark:  VoiceChannel').setThumbnail(things.headasset));
                        setTimeout(() => {
                            if (msgs.deletable) msgs.delete({ timeout: 5 });
                        }, 10000);
                    } else {
                        console.warn(`${things.sstne}*`);
                        logger.emit("warn", JSON.stringify(things.sstne));
                    }
                } catch (e) {
                    console.warn(things.sstne);
                    logger.emit("warn", `Error in -cleanup_player, catch: ${JSON.stringify(things.sstne)} emitted by user ${msg.author.tag}`);
                }
            } else {
                try {
                    const msgs = await msg.reply(nmbed(`Nothing to Cleanup`, ':warning:  VoiceChannel').setThumbnail(things.headasset));
                    setTimeout(() => {
                        if (msgs.deletable) msgs.delete({ timeout: 5 });
                    }, 10000);
                } catch (e) {
                    logger.emit("warn", `Error in -cleanup_player, second catch block: ${JSON.stringify(e)} emitted by user ${msg.author.tag}`);
                }
            }
            break;
        }
        case ("-||"):
        case ("-pause"):
        case ("-pause_player"): {
            if (msg.deletable) msg.delete({ timeout: 5 });
            if (!msg.guild) {
                msg.reply(nmbed(`Failue, you running not on a GUILD`, ':warning: VoiceChannel').setColor(0xffff00).setThumbnail(things.headasset));
                return;
            }
            const inx = userplayer.findIndex((cit) => cit.master == msg.author.id);
            if (inx >= 0) {
                const { dis, nplay } = userplayer[inx];
                try {
                    if (dis) {
                        dis.pause();
                        const msgs = await msg.reply(nmbed(`Suceedfully Paused \`${nplay}\``, ':white_check_mark:  VoiceChannel').setColor(0xffff00).setThumbnail(things.headasset));
                        setTimeout(() => {
                            if (msgs.deletable) msgs.delete({ timeout: 5 });
                        }, 10000);
                    }
                } catch (e) {
                    console.warn(things.sstne);
                    logger.emit("warn", `Error in -pause_player, catch1: ${JSON.stringify(e)} emitted by user ${msg.author.tag}`);
                }
            } else {
                try {
                    const msgs = await msg.reply(nmbed(`Nothing to Pause`, ':warning:  VoiceChannel').setColor(0xffff00).setThumbnail(things.headasset));
                    setTimeout(() => {
                        if (msgs.deletable) msgs.delete({ timeout: 5 });
                    }, 10000);
                } catch (e) {
                    logger.emit("warn", `Error in -pause_player, catch2: ${JSON.stringify(e)} emitted by user ${msg.author.tag}`);
                }
            }
            break;
        }
        case ("-resume"):
        case ("-resume_player"): {
            if (msg.deletable) msg.delete({ timeout: 5 });
            if (!msg.guild) {
                msg.reply(nmbed(`Failue, you running not on a GUILD`, ':warning: VoiceChannel').setColor(0x66ff66).setThumbnail(things.headasset));
                return;
            }
            const inx = userplayer.findIndex((cit) => cit.master == msg.author.id);
            if (inx >= 0) {
                const { dis, nplay } = userplayer[inx];
                try {
                    if (dis) {
                        dis.resume();
                        const msgs = await msg.reply(nmbed(`Suceedfully Resumed \`${nplay}\``, ':white_check_mark:  VoiceChannel').setColor(0x66ff66).setThumbnail(things.headasset));
                        setTimeout(() => {
                            if (msgs.deletable) msgs.delete({ timeout: 5 });
                        }, 10000);
                    }
                } catch (e) {
                    logger.emit("warn", `Error in -resume_player, catch1: ${JSON.stringify(things.sstne)}${JSON.stringify(e)} emitted by user ${msg.author.tag}`);
                    console.warn(things.sstne);
                }
            } else {
                try {
                    const msgs = await msg.reply(nmbed(`Nothing to Resume`, ':warning:  VoiceChannel').setColor(0x66ff66).setThumbnail(things.headasset));
                    setTimeout(() => {
                        if (msgs.deletable) msgs.delete({ timeout: 5 });
                    }, 10000);
                } catch (e) {
                    logger.emit("warn", `Error in -resume_player, catch2: ${JSON.stringify(e)} emitted by user ${msg.author.tag}`);
                }
            }
            break;
        }
        case ("-youtubetodiscord"):
        case ("-youtube2discord"): {
            if (msg.deletable) msg.delete({ timeout: 5 });
            if (sessionsofyt2discord.includes(msg.author.id)) {
                try {
                    const ld = await msg.reply(nmbed(`Only one download per user!`, ':warning: youtube2discord').setColor(0x33ccff).setThumbnail(things.headasset));
                    setTimeout(() => {
                        if (ld.deletable) ld.delete({ timeout: 5 });
                    }, 5000);
                } catch (ex) {
                    logger.emit("warn", `Error in -youtube2discord, catch1: ${JSON.stringify(ex)} emitted by user ${msg.author.tag}`);
                }
            } else {
                const position = sessionsofyt2discord.push(msg.author.id) - 1;
                const cleanupthis = () => {
                    logger.emit("info", `User ${msg.author.tag} converter cleaning up`);
                    if (sessionsofyt2discord.includes(msg.author.id)) {
                        sessionsofyt2discord.splice(position, 1);
                    } else {
                        logger.emit("err", `Unexpected output -youtube2discord | User: ${msg.author.tag} | List: ${JSON.stringify(sessionsofyt2discord)}`);
                    }
                };
                if (splcon.length >= 2) {
                    if (/((http|https):\/\/)?(www\.)?(youtube\.com)(\/)?([a-zA-Z0-9\-\.]+)\/?/.test(splcon[1]) && ytdl.validateURL(splcon[1])) {
                        let title = "", authorlink = "", author = "", thumbnailicon = "";
                        const link = splcon[1];
                        logger.emit("info", `User ${msg.author.tag} conveting the video ${splcon[1]}`);
                        try {
                            const md = await ymd(splcon[1]);
                            title = `--${Discord.Util.escapeMarkdown(md.title)}`;
                            if (md.embedinfo) {
                                title = Discord.Util.escapeMarkdown(`${md.embedinfo.author_name}${title}`);
                                authorlink = Discord.Util.escapeMarkdown(md.embedinfo.author_url);
                                author = Discord.Util.escapeMarkdown(md.embedinfo.author_name);
                                thumbnailicon = md.embedinfo.thumbnail_url;
                            }
                        } catch (e) {
                            logger.emit("warn", `Error in -youtube2discord, catch2: ${JSON.stringify(ex)} emitted by user ${msg.author.tag}`);
                        }
                        try {
                            if (((await ytdl.getBasicInfo(splcon[1])).player_response.streamingData.formats[0].approxDurationMs * 0.000017) <= 10) {
                                let str = ytdl(splcon[1], { filter: 'audioonly' });
                                msg.channel.send(nmbed(`:arrow_down: Starting Download`, ':arrow_down: youtube2discord').setColor(0x33ccff).setThumbnail(things.headasset));
                                str.on("end", cleanupthis);
                                str.on("error", (err) => {
                                    cleanupthis();
                                    msg.reply(nmbed(`An Error Occured`, ':warning: youtube2discord').setColor(0x33ccff).setThumbnail(things.headasset));
                                    console.log(err);
                                });
                                let mbedv = nmbed(
                                    `Video Converted by \`${msg.author.username}\``,
                                    ":arrow_down: youtube2discord");
                                if (author != "") {
                                    mbedv.addField("Video Creator", authorlink == "" ? `${author}` : `[${author}](${authorlink})`);
                                }
                                if (title != "") {
                                    mbedv.addField("Video Title", title != "" ? `[${title}](${link})` : "");
                                }
                                msg.reply(mbedv.attachFiles([new Discord.MessageAttachment(str, `${Discord.Util.escapeMarkdown(msg.author.username.split(/[^A-Za-z1-9\.]/).join(""))}_${title}.mp3`)])
                                    .setColor(0x33ccff)
                                    .setAuthor(msg.author.username, msg.author.avatarURL()).setThumbnail(thumbnailicon && thumbnailicon != "" ? thumbnailicon : things.headasset));
                            } else {
                                cleanupthis();
                                msg.reply(nmbed(`The Video is to Big to Upload it\n[But you can view it here](${link})`, ':warning: youtube2discord').setColor(0x33ccff).setThumbnail(thumbnailicon && thumbnailicon != "" ? thumbnailicon : things.headasset));
                            }
                        } catch (e) {
                            logger.emit("warn", `Error in -youtube2discord, catch3: ${JSON.stringify(e)} emitted by user ${msg.author.tag}`);
                            cleanupthis();
                            try {
                                const msgs = await msg.reply(nmbed(`Connection Timeout to Discord`, ':warning: youtube2discord').setColor(0x33ccff).setThumbnail(thumbnailicon && thumbnailicon != "" ? thumbnailicon : things.headasset));
                                setTimeout(() => {
                                    if (msgs.deletable) msgs.delete({ timeout: 5 });
                                }, 10000);
                            } catch (e) {
                                logger.emit("warn", `Error in -youtube2discord, catch4: ${JSON.stringify(e)} emitted by user ${msg.author.tag}`);
                            }
                        }
                    } else {
                        cleanupthis();
                        try {
                            const msgs = await msg.reply(nmbed(`The Url doesn't work`, ':warning: youtube2discord').setColor(0x33ccff).setThumbnail(thumbnailicon && thumbnailicon != "" ? thumbnailicon : things.headasset));
                            setTimeout(() => {
                                if (msgs.deletable) msgs.delete({ timeout: 5 });
                            }, 10000);
                        } catch (e) {
                            logger.emit("warn", `Error in -youtube2discord, catch5: ${JSON.stringify(ex)} emitted by user ${msg.author.tag}`);
                        }
                    }
                } else {
                    cleanupthis();
                    try {
                        const msgs = await msg.reply(nmbed(`We need a YouTube Video as second arg!`, ':warning: youtube2discord').setColor(0x33ccff).setThumbnail(things.headasset));
                        setTimeout(() => {
                            if (msgs.deletable) msgs.delete({ timeout: 5 });
                        }, 10000);
                    } catch (e) {
                        logger.emit("warn", `Error in -youtube2discord, catch6: ${JSON.stringify(ex)} emitted by user ${msg.author.tag}`);
                    }
                }
            }
            break;
        }
        default: {
        }
    }
});

client.login(botkey);