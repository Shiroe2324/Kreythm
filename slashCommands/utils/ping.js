const { SlashCommandBuilder } = require('discord.js');

class Ping {
    static data = new SlashCommandBuilder()
        .setName('ping')
        .setDescription('comando de pruebas')
        .setDMPermission(false)

    constructor(interaction, utils, discord) {
        this.interaction = interaction;
        this.utils = utils;
        this.discord = discord;
    }

    async execute() {
        this.interaction.reply('pong!') // se envia un mensaje que contiene 'pong!'
    }
}

module.exports = Ping;