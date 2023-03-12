/* eslint no-eval: 0, no-unused-vars: 0 */

const { inspect } = require('util')
const osuApi = require('../../utils/osuApi')

class Eval {
  static name = 'eval'
  static aliases = ['e']

  constructor (message, args, utils, discord, moment) {
    this.message = message
    this.args = args
    this.utils = utils
    this.discord = discord
    this.moment = moment
    this.send = (data, replied) => utils.sendMessage(message, data, replied)
  }

  information = {
    name: 'eval',
    aliases: ['e'],
    description: 'Ejecuta el codigo ingresado',
    cooldown: 0,
    category: 'privados',
    usage: 'ping',
    private: true
  }

  async execute () {
    if (!process.env.OWNERS.split(' ').some(owner => owner === this.message.author.id)) return // retorna si el autor del mensaje no es parte de los dueños del bot

    const code = this.args.join(' ') // codigo ingresado a ejecutar
    if (!code) return // retorna si no se ingresó codigo

    try {
      const evaled = await eval(code) // se evalua el codigo
      const result = inspect(evaled, { depth: 0 }) // y se inspecciona para una mejor visualización

      this.send(this.discord.codeBlock('js', result)) // se envía el resultado del codigo
    } catch (err) {
      this.send(this.discord.codeBlock('js', err)) // se envía si hubo un error al ejecutar el codigo
    }
  }
}

module.exports = Eval
