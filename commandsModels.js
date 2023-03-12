/* eslint no-unused-vars: 0 */

// Modelo de un comando de prefix
class Command {
  static name = '' // nombre del comando
  static aliases = [] // los aliases del comando

  // constructor cuando se inicializa el comando
  constructor (message, args, utils, discord, moment) {
    this.message = message // el mensaje que envió el usuario
    this.args = args // los argumentos del mensaje
    this.utils = utils // las funciones de ayuda
    this.discord = discord // la libreria de discordjs
    this.moment = moment // la libreria de momentjs para manejar fechas
    this.send = (data, replied) => utils.sendMessage(message, data, replied) // función para enviar un mensaje
  }

  // información sobre el comando
  information = {
    name: '', // nombre principal del comando
    aliases: [], // nombres del comando
    description: '', // descripción del comando
    cooldown: 0, // tiempo de espera del comando
    category: '', // categoria del comando
    usage: '' // uso del comando
    // private: true // booleano que indica si el comando es de uso privado por los dueños del bot
  }

  // función de ejecución del comando
  async execute () {

  }
}
/* module.exports = command */

// Modelo de un comando con varios nombres
class MultiNameCommand {
  static names = [] // nombres del comando

  // constructor cuando se inicializa el comando
  constructor (message, args, utils, discord, moment) {
    this.message = message // el mensaje que envió el usuario
    this.name = message.content.slice(process.env.PREFIX.length).trim().split(/\s+/g).shift().toLowerCase() // comando ejecutado
    this.args = args // los argumentos del mensaje
    this.utils = utils // las funciones de ayuda
    this.discord = discord // la libreria de discordjs
    this.moment = moment // la libreria de momentjs para manejar fechas
    this.send = (data, replied) => utils.sendMessage(message, data, replied) // función para enviar un mensaje
  }

  // información sobre el comando
  information = {
    name: '', // nombre principal del comando
    aliases: [], // nombres del comando
    description: '', // descripción del comando
    cooldown: 0, // tiempo de espera del comando
    category: '', // categoria del comando
    usage: '' // uso del comando
  }

  // función de ejecución del comando
  async execute () {

  }
}
/* module.exports = MultiNameCommand */

// Modelo de un slash command
const { SlashCommandBuilder } = require('discord.js') // metodo de constructor de slash commands

class SlashCommand {
  // constructor del slash command
  static data = new SlashCommandBuilder()
    .setName('')
    .setDescription('')
    .setDMPermission(false)
  // ... opciones adicionales de los slash commands

  // constructor cuando se inicializa el comando
  constructor (interaction, utils, discord, moment) {
    this.interaction = interaction // comando hecho
    this.utils = utils // las funciones de ayuda
    this.discord = discord // la libreria del discord.js
    this.moment = moment // la libreria de momentjs para manejar fechas
  }

  // información sobre el comando
  information = {
    name: '', // nombre principal del comando
    description: '', // descripción del comando
    cooldown: 0, // tiempo de espera del comando
    category: '', // categoria del comando
    usage: '' // uso del comando
  }

  // función de ejecución del comando
  async execute () {

  }
}
/* module.exports = SlashCommand */
