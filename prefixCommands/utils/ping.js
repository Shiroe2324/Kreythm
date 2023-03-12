class Ping {
  static name = 'ping'
  static aliases = ['pong']

  constructor (message, args, utils, discord, moment) {
    this.message = message
    this.args = args
    this.utils = utils
    this.discord = discord
    this.moment = moment
    this.send = (data, replied) => utils.sendMessage(message, data, replied)
  }

  information = {
    name: 'ping',
    aliases: ['pong'],
    description: 'Comando de Pruebas',
    cooldown: 0,
    category: 'utiles',
    usage: 'ping'
  }

  async execute () {
    const date = Date.now() // fecha antes de enviar el mensaje
    const message = await this.send('calculando...') // se envía el mensaje

    // se edita el mensaje restando la fecha anterior con la actual para calcular el ping
    return message.edit(`El ping actualmente es de: **${Date.now() - date}ms**`)
  }
}

module.exports = Ping
