const { SlashCommandBuilder } = require('discord.js')
const emotes = require('../../utils/emotes.json')

class OsuUser {
  static data = new SlashCommandBuilder()
    .setName('osu_user')
    .setDescription('Muestra la información de Osu! de un usuario buscado o vinculado al bot')
    .setDMPermission(false)
    .addSubcommand(subcommand => subcommand
      .setName('id')
      .setDescription('Busca el usuario por medio de su id de osu, su nombre de osu o su id de discord')
      .addStringOption(option => option
        .setName('user')
        .setDescription('El usuario a buscar')
        .setRequired(true)
      )
      .addStringOption(option => option
        .setName('mode')
        .setDescription('El modo de juego (por defecto es el modo principal del usuario)')
        .addChoices(
          { name: 'standard', value: 'osu' },
          { name: 'taiko', value: 'taiko' },
          { name: 'fruits', value: 'fruits' },
          { name: 'mania', value: 'mania' }
        )
      )
    )
    .addSubcommand(subcommand => subcommand
      .setName('member')
      .setDescription('Busca tu usuario o el de otra persona si lo tiene vinculado al bot')
      .addUserOption(option => option
        .setName('member')
        .setDescription('Miembro de discord a buscar')
      )
      .addStringOption(option => option
        .setName('mode')
        .setDescription('El modo de juego (por defecto es el vinculado al bot)')
        .addChoices(
          { name: 'standard', value: 'osu' },
          { name: 'taiko', value: 'taiko' },
          { name: 'fruits', value: 'fruits' },
          { name: 'mania', value: 'mania' }
        )
      )
    )

  constructor (interaction, utils, discord, moment) {
    this.interaction = interaction
    this.utils = utils
    this.discord = discord
    this.moment = moment
  }

  information = {
    name: 'Osu User',
    description: 'Muestra la información de Osu! de un usuario mencionado',
    cooldown: 0,
    category: 'osu',
    usage: '</osu_user id:1083872105080291369> </osu_user member:1083872105080291369>'
  }

  async execute () {
    let mode = this.interaction.options.getString('mode') // modo de juego a buscar
    let user // el usuario a buscar

    if (this.interaction.options.getSubcommand() === 'member') {
      const member = this.interaction.options.getUser('member') ?? this.interaction.user // el autor o usuario mencionado
      user = await this.utils.getOsuUser(2, member.id, mode) // busqueda del usuario
      if (!user && member.id === this.interaction.user.id) return this.interaction.reply({ content: 'No tienes tu cuenta vinculada al bot, la puedes vincular con el comando </osuset user:1084282864033599518>', ephemeral: true })
      if (!user) return this.interaction.reply({ content: 'El usuario mencionado no tiene su cuenta vinculada al bot', ephemeral: true })
      mode = user.mode
    }

    if (this.interaction.options.getSubcommand() === 'id') {
      const id = this.interaction.options.getString('user') // el usuario a buscar
      user = await this.utils.getOsuUser(2, id, mode) // busqueda del usuario
      if (!user) return this.interaction.reply({ content: 'El usuario mencionado no existe o no tiene su cuenta vinculada al bot', ephemeral: true })
      mode = user.mode
    }

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

    return this.interaction.reply({ embeds: [embed] }) // se envía el embed
  }
}

module.exports = OsuUser
