/* eslint no-unused-vars: 0 */

const { Message } = require('discord.js')
const schemas = require('./schemas')
const api = require('./osuApi')

const Modes = {
  osu: 0,
  taiko: 1,
  fruits: 2,
  mania: 3,
  0: 'osu',
  1: 'taiko',
  2: 'fruits',
  3: 'mania'
}

// aquí estaran algunas funciones  y constantes necesarias de ayuda
module.exports = {
  /** Modos de juego de osu */
  modes: Modes,

  /**
   * devuelve un número aleatorio en el limite ingresado o devuelve un elemento aleatorio de un array ingresado.
   * @param {number|array} max - el limite o el array ingresado.
   * @returns {number|any} el número sacado o el elemento sacado.
   */
  random: (max = 0) => {
    if (typeof max === 'object') {
      return max[Math.floor(Math.random() * max.length)]
    } else {
      return Math.floor(Math.random() * max + 1)
    }
  },

  /**
   * Envía o responde un mensaje en un canal.
   * @param {Message} msg - el mensaje envíado por el usuario.
   * @param {string|object} data - datos o contenido a enviar.
   * @param {boolean} replied - un booleano que se encarga de verificar si el respondido tiene mención.
   * @returns {Message} el mensaje enviado.
   */
  sendMessage: async (msg, data, replied = false) => {
    let message

    try {
      if (typeof data === 'object') {
        message = await msg.reply({ ...data, allowedMentions: { repliedUser: replied } })
      } else {
        message = await msg.reply({ content: data, allowedMentions: { repliedUser: replied } })
      }
    } catch (err) {
      message = await msg.channel.send(data)
    }

    return message
  },

  /**
   * Buscar un usuario de osu por medio de la base de datos o por medio de la id de discord o de osu.
   * @param {number} version - version de la osu! api a devolver.
   * @param {string} id - la id de usuario de discord o de osu.
   */
  getOsuUser: async (version, id, Mode) => {
    const UserDB = await schemas.OsuUser.findOne({ discordID: id })

    if (UserDB) {
      if (version === 1) {
        const user = await api(1, 'get_user', { u: UserDB.id, m: Mode || UserDB.defaultMode })
        return user ? { data: user, mode: Mode || UserDB.defaultMode } : null
      } else if (version === 2) {
        const user = await api(2, `users/${UserDB.id}/${Mode || UserDB.defaultMode}`)
        return user ? { data: user, mode: Mode || UserDB.defaultMode } : null
      }
    }

    if (version === 1) {
      const user = await api(1, 'get_user', { u: id, m: Modes[Mode] || 0 })
      return user ? { data: user, mode: Mode || 'osu' } : null
    } else if (version === 2) {
      const user = await api(2, `users/${id}${Mode ? `/${Mode}` : ''}`)
      return user ? { data: user, mode: Mode || user.playmode } : null
    }
  }
}
