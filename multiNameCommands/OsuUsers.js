const emotes = require('../utils/emotes.json')

class OsuUser {
  static names = ['std', 'osu', 'ctb', 'fruits', 'taiko', 'mania']

  constructor (message, args, utils, discord, moment) {
    this.message = message
    this.name = message.content.slice(process.env.PREFIX.length).trim().split(/\s+/g).shift().toLowerCase()
    this.args = args
    this.utils = utils
    this.discord = discord
    this.moment = moment
    this.send = (data, replied) => utils.sendMessage(message, data, replied)
  }

  information = {
    name: 'Osu User',
    aliases: ['std', 'osu', 'ctb', 'fruits', 'taiko', 'mania'],
    description: 'Muestra la información de Osu! de un usuario mencionado, dependiendo del alias colocado se buscará un modo de juego',
    cooldown: 5000,
    category: 'osu',
    usage: 'osu [usuario]'
  }

  async execute () {
    let mode // modo de juego

    // se verifica cual modo de juego se quiere buscar
    switch (this.name) {
      case 'std': mode = 'osu'; break
      case 'osu': mode = 'osu'; break
      case 'ctb': mode = 'fruits'; break
      case 'fruits': mode = 'fruits'; break
      case 'taiko': mode = 'taiko'; break
      case 'mania': mode = 'mania'; break
    }

    const id = this.message.mentions.members.first()?.id || this.args[0] || this.message.author.id // id a de osu o de discord
    const user = await this.utils.getOsuUser(2, id, mode) // busqueda del usuario

    if (!user && id === this.message.author.id) return this.send(`No tienes tu cuenta vinculada al bot, la puedes vincular con el comando ${process.env.PREFIX}osuset -u (nombre o id de osu)`) // retorna si no encuentra nigún usuario y el autor no colocó nada
    if (!user) return this.send('No se encontró ningún usuario') // retorna si no encuentra nigún usuario

    // descripción del embed con la información de del usuario
    const description = [
      `**❯ Rango:** #${user.data.statistics.global_rank} - ( :flag_${user.data.country_code.toLocaleLowerCase()}: #${user.data.statistics.country_rank ? user.data.statistics.country_rank : null} )`,
      `**❯ Rango más alto:** #${user.data.rank_highest ? user.data.rank_highest.rank : null} - ( ${user.data.rank_highest ? this.moment(user.data.rank_highest.updated_at).format('ll') : null} )`,
      `**❯ Total de jugadas:** ${user.data.statistics.play_count}`,
      `**❯ Nivel:** ${user.data.statistics.level.current} - ( %${user.data.statistics.level.progress} )`,
      `**❯ Precisión:** %${user.data.statistics.hit_accuracy}`,
      `**❯ PP:** ${user.data.statistics.pp}`
    ]

    // un campo del embed con la información de las estadisticas del usuario
    const field = {
      name: 'Estadisticas',
      value: [
        `${emotes.ssh}: ${user.data.statistics.grade_counts.ssh}`,
        `${emotes.ss}: ${user.data.statistics.grade_counts.ss}`,
        `${emotes.sh}: ${user.data.statistics.grade_counts.sh}`,
        `${emotes.s}: ${user.data.statistics.grade_counts.s}`,
        `${emotes.a}: ${user.data.statistics.grade_counts.a}`
      ].join('\n')
    }

    // el embed a mandar en el mensaje con toda la información
    const embed = new this.discord.EmbedBuilder()
      .setAuthor({ name: `Información de ${user.data.username} en Osu!${mode === 'osu' ? '' : mode}`, url: `https://osu.ppy.sh/users/${user.data.id}` }) // autor o titulo del embed con link a la pagina del usuario
      .setThumbnail(user.data.avatar_url || null) // imagen miniatura del embed
      .setDescription(description.join('\n')) // descripción del embed
      .addFields([field]) // campos del embed
      .setFooter({ text: user.data.is_online ? 'En linea' : 'Desconectado' }) // pie de pagina del embed
      .setColor(user.data.profile_colour ?? process.env.EMBED_COLOR) // color del embed

    return this.send({ embeds: [embed] }) // se envía el embed
  }
}

module.exports = OsuUser
