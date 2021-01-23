'use strict';
console.log("Sharkbyte ARAK Discord Bot\n\xa9 Sharkbyteprojects");
const botkey = require("./settings/usr.json").key;
const status = ['available', 'idle', 'dnd', 'invisible'];
const Discord = require('discord.js');
const client = new Discord.Client();
var userplayer = [];
const fs = require("./appfiles/ftool");
const tr = require("./appfiles/trcatch");
const ytdl = require('ytdl-core');
const { ymd } = require("./appfiles/ftool");
const things = { sstne: "Something stored doesn't exist, but that's not a Problem", fields: require("./appfiles/names_nochange.json"), help: require("./appfiles/help.json"), dtypedecode: ["string", "[[string]]"], dtd: ["string", "object"], headasset: "https://github.com/fire-engine-icons/img-host/raw/master/hfws_hsm_emote.png" };

function errorm(e) {
    client.user.setStatus(status[3]);
    console.error(e);
}

const stats = () => {
    const booool = userplayer.length > 0;
    client.user.setActivity(`${booool ? `Musicsessions: ${userplayer.length} | ` : ""}-help`, { type: booool ? "PLAYING" : "WATCHING" });
};

function nmbed(strin, g) {
    let embed = new Discord.MessageEmbed()
        .setTitle(g)
        .setColor(0xff0000)
        .setAuthor(client.user.username, client.user.avatarURL())
        .setDescription(strin)
        .setFooter("\xa9 Sharkbyteprojects");
    return embed;
}
var sessionsofyt2discord = [];
client.on('ready', tr(() => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setStatus(status[0]);
    stats();
    setInterval(stats, 1000 * 2);
}, errorm));
const embedFooterString = "User ${usr} sended this message";
client.on('message', async msg => {
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
                    msg.reply(nmbed(`I thing you have a Typing: ${xxxx}`, ":warning: embed"));
                    return;
                }
                let embedcreator = new Discord.MessageEmbed().setAuthor(msg.author.tag, msg.author.avatarURL(), msg.author.defaultAvatarURL);
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
                } catch (er) { sw(); }
                embedcreator
                    .setDescription(mdl.description)
                    .setColor(hexnum)
                    .setTitle(mdl.title)
                    .setFooter(embedFooterString.replace("${usr}", msg.author.username));
                msg.channel.send(embedcreator);
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
                msg.reply(nmbed(`Failue, you running not on a GUILD`, ':warning: Server Management - Admin'));
                return;
            }
            msg.guild.members.fetch(msg.guild.ownerID)
                .then(guildMember => {
                    msg.reply(nmbed(`The admin is ${guild.member(guildMember) ? guildMember.toString() : guild.owner.user.tag}`, 'Server Management - Admin'));
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
                } catch (e) { }
                return;
            }
            const user = msg.mentions.users.first();
            if (user) {
                let ui = nmbed(`Infos about ${user.username}`, 'Whois')
                    .setThumbnail(user.avatarURL())
                    .addField("Tag", user.tag)
                    .addField("Bot", user.bot ? "Yes" : "No")
                    .addField("Flags", JSON.stringify(user.flags.toArray()))
                    .addField("Account created at", user.createdAt.toUTCString())
                    .addField("Link to Image", user.avatarURL());
                msg.reply(ui);
                try {
                    const av = msg.guild != null ? msg.guild.available : false;
                    await user.send(nmbed('You where `-whois`', ":question:  WHOIS Information").addField(":service_dog: Server", av ? msg.guild.name : "No server Information available").addField("by", msg.author.username).addField("Tag of User", msg.author.tag).setAuthor(msg.author.tag, msg.author.avatarURL()).setThumbnail(av ? msg.guild.iconURL() : msg.author.avatarURL()));
                } catch (nulls) { }
            } else {
                try {
                    const xr = await msg.reply(nmbed(`No User mentioned`, 'Whois'));
                    setTimeout(() => {
                        if (xr.deletable) xr.delete({ timeout: 5 });
                    }, 4000);
                } catch (e) { }
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
                } catch (e) { console.warn(things.sstne); }
            }
            // Only try to join the sender's voice channel if they are in one themselves
            if (msg.member.voice.channel) {
                if (splcon.length >= 2) {
                    if (/((http|https):\/\/)?(www\.)?(youtube\.com)(\/)?([a-zA-Z0-9\-\.]+)\/?/.test(splcon[1]) && ytdl.validateURL(splcon[1])) {
                        try {
                            const connection = await msg.member.voice.channel.join();
                            const dispatcher = connection.play(ytdl(splcon[1], { filter: 'audioonly' }));
                            const cc = userplayer.push({ dis: dispatcher, c: msg.member.voice.channel, master: msg.author.id, nplay: splcon[1] }) - 1;
                            dispatcher.on("start", async () => {
                                try {
                                    const msgs = (await msg.reply(nmbed(`Start Playing \`${splcon[1]}\``, ':headphones:  VoiceChannel').setColor(0x66ff66).setThumbnail(things.headasset)));
                                    setTimeout(() => {
                                        if (msgs.deletable) msgs.delete({ timeout: 5 });
                                    }, 10000);
                                } catch (e) { }
                            });
                            dispatcher.on('finish', async () => {
                                try {
                                    const msgs = (await msg.reply(nmbed(`Finished Playing \`${splcon[1]}\``, ':headphones:  VoiceChannel').setColor(0x66ff66).setThumbnail(things.headasset)));
                                    setTimeout(() => {
                                        if (msgs.deletable) msgs.delete({ timeout: 5 });
                                    }, 10000);
                                } catch (e) { }
                                userplayer.splice(cc);
                                msg.member.voice.channel.leave();
                            });
                            dispatcher.on('error', async (xer) => {
                                try {
                                    const msgs = (await msg.reply(nmbed(`An error Occured`, ':warning: VoiceChannel').setColor(0x66ff66).setThumbnail(things.headasset)));
                                    setTimeout(() => {
                                        if (msgs.deletable) msgs.delete({ timeout: 5 });
                                    }, 10000);
                                } catch (e) { }
                                console.error(xer);
                            });
                        } catch (e) {
                            const msgs = await msg.reply(nmbed(`The Url doesn't work or\nConnection Timeout to Discord`, ':warning: VoiceChannel').setColor(0x66ff66).setThumbnail(things.headasset));
                            setTimeout(() => {
                                if (msgs.deletable) msgs.delete({ timeout: 5 });
                            }, 10000);
                        }
                    } else {
                        try {
                            const msgs = await msg.reply(nmbed(`The Url doesn't work`, ':warning: VoiceChannel').setColor(0x33ccff).setThumbnail(things.headasset));
                            setTimeout(() => {
                                if (msgs.deletable) msgs.delete({ timeout: 5 });
                            }, 10000);
                        } catch (e) { }
                    }
                } else {
                    const msgs = await msg.reply(nmbed(`We need a YouTube Video as second arg!`, ':warning: VoiceChannel').setColor(0x66ff66).setThumbnail(things.headasset));
                    setTimeout(() => {
                        if (msgs.deletable) msgs.delete({ timeout: 5 });
                    }, 10000);
                }
            } else {
                const msgs = await msg.reply(nmbed(`You need to join a voice channel first!`, ':warning: VoiceChannel').setColor(0x66ff66).setThumbnail(things.headasset));
                setTimeout(() => {
                    if (msgs.deletable) msgs.delete({ timeout: 5 });
                }, 10000);
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
                    } else { console.warn(`${things.sstne}*`); }
                } catch (e) { console.warn(things.sstne); }
            } else {
                try {
                    const msgs = await msg.reply(nmbed(`Nothing to Cleanup`, ':warning:  VoiceChannel').setThumbnail(things.headasset));
                    setTimeout(() => {
                        if (msgs.deletable) msgs.delete({ timeout: 5 });
                    }, 10000);
                } catch (e) { }
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
                } catch (e) { console.warn(things.sstne); }
            } else {
                try {
                    const msgs = await msg.reply(nmbed(`Nothing to Pause`, ':warning:  VoiceChannel').setColor(0xffff00).setThumbnail(things.headasset));
                    setTimeout(() => {
                        if (msgs.deletable) msgs.delete({ timeout: 5 });
                    }, 10000);
                } catch (e) { }
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
                } catch (e) { console.warn(things.sstne); }
            } else {
                try {
                    const msgs = await msg.reply(nmbed(`Nothing to Resume`, ':warning:  VoiceChannel').setColor(0x66ff66).setThumbnail(things.headasset));
                    setTimeout(() => {
                        if (msgs.deletable) msgs.delete({ timeout: 5 });
                    }, 10000);
                } catch (e) { }
            }
            break;
        }
        case ("-youtube2discord"): {
            if (msg.deletable) msg.delete({ timeout: 5 });
            if (sessionsofyt2discord.includes(msg.author.id)) {
                try {
                    const ld = await msg.reply(nmbed(`Only one download per user!`, ':warning: youtube2discord').setColor(0x33ccff).setThumbnail(things.headasset));
                    setTimeout(() => {
                        if (ld.deletable) ld.delete({ timeout: 5 });
                    }, 5000);
                } catch (ex) { }
            } else {
                const position = sessionsofyt2discord.push(msg.author.id) - 1;
                const cleanupthis = () => {
                    if (sessionsofyt2discord.includes(msg.author.id)) {
                        sessionsofyt2discord.splice(position, 1);
                    }
                };
                if (splcon.length >= 2) {
                    if (/((http|https):\/\/)?(www\.)?(youtube\.com)(\/)?([a-zA-Z0-9\-\.]+)\/?/.test(splcon[1]) && ytdl.validateURL(splcon[1])) {
                        try {
                            let str = ytdl(splcon[1], { filter: 'audioonly' });
                            let title = "";
                            let authorlink = "";
                            let author = "";
                            const link = splcon[1];
                            try {
                                const md = await ymd(splcon[1]);
                                title = `--${md.title}`;
                                if (md.embedinfo) {
                                    title = `${md.embedinfo.author_name}${title}`;
                                    authorlink = md.embedinfo.author_url;
                                    author = md.embedinfo.author_name;
                                }
                            } catch (e) { }
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
                            if (author != "")
                                mbedv.addField("Video Creator", authorlink == "" ? `${author}` : `[${author}](${authorlink})`);

                            if (title != "")
                                mbedv.addField("Vido Title", title != "" ? `[${title}](${link})` : "");
                            msg.reply(
                                embedv.attachFiles([new Discord.MessageAttachment(str, `${msg.author.username.split(/[^A-Za-z1-9.]/).join("")}${title}.mp3`)]
                                )
                                    .setColor(0x33ccff)
                                    .setAuthor(msg.author.username, msg.author.avatarURL()).setThumbnail(things.headasset));
                        } catch (e) {
                            cleanupthis();
                            try {
                                const msgs = await msg.reply(nmbed(`Connection Timeout to Discord`, ':warning: youtube2discord').setColor(0x33ccff).setThumbnail(things.headasset));
                                setTimeout(() => {
                                    if (msgs.deletable) msgs.delete({ timeout: 5 });
                                }, 10000);
                            } catch (e) { }
                        }
                    } else {
                        cleanupthis();
                        try {
                            const msgs = await msg.reply(nmbed(`The Url doesn't work`, ':warning: youtube2discord').setColor(0x33ccff).setThumbnail(things.headasset));
                            setTimeout(() => {
                                if (msgs.deletable) msgs.delete({ timeout: 5 });
                            }, 10000);
                        } catch (e) { }
                    }
                } else {
                    cleanupthis();
                    try {
                        const msgs = await msg.reply(nmbed(`We need a YouTube Video as second arg!`, ':warning: youtube2discord').setColor(0x33ccff).setThumbnail(things.headasset));
                        setTimeout(() => {
                            if (msgs.deletable) msgs.delete({ timeout: 5 });
                        }, 10000);
                    } catch (e) { }
                }
            }
            break;
        }
        default: {
        }
    }
});

client.login(botkey);