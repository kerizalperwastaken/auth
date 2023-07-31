module.exports = {

    token: process.env.token,
    authDevelopers: ['1125797410690564187','1125797410690564187'], // developers
    authOwners: ['1125797410690564187'], // whitelist

    webhook: {
        name: 'Log',
           avatar: 'https://cdn.discordapp.com/attachments/1045426334853242890/1127654156790931498/EVENING_GFX_1.png',
        url: process.env.webhook,
    },

    client: {
        id: process.env.id,
        secret: process.env.secret,
        redirect_uri: "https://verify.k3riz.repl.co/auth",
        scope: ['identify', 'guilds.join'],
        footer: "v1.0", // footer
        serverLink: "https://discord.gg/hdporns", // server
    },

    web: {
        port: 319,
        apiKey: "n7275m1rwnnlcjd0"
    },

    database: {

       URI: process.env.db,

    }

}
