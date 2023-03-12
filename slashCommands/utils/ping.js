const { SlashCommandBuilder } = require('discord.js')

class Ping {
  static data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('comando de pruebas')
    .setDMPermission(false)

  constructor (interaction, utils, discord, moment) {
    this.interaction = interaction
    this.utils = utils
    this.discord = discord
    this.moment = moment
  }

  information = {
    name: 'ping',
    description: 'Comando de Pruebas',
    cooldown: 0,
    category: 'utiles',
    usage: '</ping:1080957130938523648>'
  }

  async execute () {
    this.interaction.reply('pong!') // se envia un mensaje que contiene 'pong!'
  }
}

module.exports = Ping
