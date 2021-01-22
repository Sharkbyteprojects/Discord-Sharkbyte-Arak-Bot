'use strict';
const botkey = require("./settings/usr.json").key;
const status = ['available', 'idle', 'dnd', 'invisible'];
const Discord = require('discord.js');
const client = new Discord.Client();
let cint = 0;
const gamesOfBot = require("./settings/gob.json");
const tr = require("./appfiles/trcatch");
const ytdl = require('ytdl-core');
const things = { fields: require("./appfiles/names_nochange.json"), help: require("./appfiles/help.json"), dtypedecode: ["string", "[[string]]"], dtd: ["string", "object"] };

function errorm(e) {
    client.user.setStatus(status[3]);
    console.error(e);
}

const stats = () => {
    client.user.setActivity(gamesOfBot[cint].n, { type: gamesOfBot[cint].t });
    if (!(++cint < gamesOfBot.length)) {
        cint = 0;
    }
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

client.on('ready', tr(() => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setStatus(status[0]);
    stats();
    setInterval(stats, 1000 * 10);
}, errorm));
const embedFooterString = "User ${usr} sended this message";
var userplayer = {};
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
                .setTitle('Sharkbyte ARAK Help')
                .setColor(0xff0000)
                .setAuthor(client.user.tag, client.user.avatarURL())
                .setDescription(things.help[cc].desc)
                .setFooter("\xa9 Sharkbyteprojects");
            for (let e of Object.entries(things.help[cc].field)) {
                embed.addField(...e);
            }
            msg.reply(embed);
            break;
        }
        case ("-admin"): {
            if (msg.deletable) msg.delete({ timeout: 5 });
            const guild = msg.guild;
            if (!guild.available) {
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
            if (!guild.available) {
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
            if (!guild.available) {
                const xr = await msg.reply(nmbed(`Failue, can't Fetch GUILD`, ':warning: Whois'));
                setTimeout(() => {
                    if (xr.deletable) xr.delete({ timeout: 5 });
                }, 4000);
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
            } else {
                const xr = await msg.reply(nmbed(`No User mentioned`, 'Whois'));
                setTimeout(() => {
                    if (xr.deletable) xr.delete({ timeout: 5 });
                }, 4000);
            }
            break;
        }
        case ("-play"): {
            if (msg.deletable) msg.delete({ timeout: 5 });
            if (!msg.guild) {
                msg.reply(nmbed(`Failue, you running not on a GUILD`, ':warning: VoiceChannel'));
                return;
            }
            // Only try to join the sender's voice channel if they are in one themselves
            if (msg.member.voice.channel) {
                if (splcon.length >= 2) {
                    if (/((http|https):\/\/)?(www\.)?(youtube\.com)(\/)?([a-zA-Z0-9\-\.]+)\/?/.test(splcon[1])) {
                        const connection = await msg.member.voice.channel.join();
                        try {
                            const dispatcher = connection.play(ytdl(splcon[1], { filter: 'audioonly' }));
                            dispatcher.on("start", async () => {
                                const msgs = await msg.reply(nmbed(`Start Playing \`${splcon[1]}\``, ':headphones:  VoiceChannel'));
                                setTimeout(() => {
                                    if (msgs.deletable) msgs.delete({ timeout: 5 });
                                }, 10000);
                            });
                            dispatcher.on('finish', async () => {
                                const msgs = await msg.reply(nmbed(`Finished Playing \`${splcon[1]}\``, ':headphones:  VoiceChannel'));
                                setTimeout(() => {
                                    if (msgs.deletable) msgs.delete({ timeout: 5 });
                                }, 10000);
                                msg.member.voice.channel.leave();
                            });
                            dispatcher.on('error', async (xer) => {
                                const msgs = await msg.reply(nmbed(`An error Occured`, ':warning: VoiceChannel'));
                                setTimeout(() => {
                                    if (msgs.deletable) msgs.delete({ timeout: 5 });
                                }, 10000);
                                console.error(xer);
                            });
                        } catch (e) {
                            msg.reply(nmbed(`I think the Url doesn't work!`, ':warning: VoiceChannel'));
                        }
                    }
                } else {
                    msg.reply(nmbed(`We need a YouTube Video as second arg!`, ':warning: VoiceChannel'));
                }
            } else {
                msg.reply(nmbed(`You need to join a voice channel first!`, ':warning: VoiceChannel'));
            }
            break;
        }
        default: {
        }
    }
});

client.login(botkey);