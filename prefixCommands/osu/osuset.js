const schemas = require('../../utils/schemas')
const api = require('../../utils/osuApi')

class OsuSet {
  static name = 'osuset'
  static aliases = []

  constructor (message, args, utils, discord, moment) {
    this.message = message
    this.args = args
    this.utils = utils
    this.discord = discord
    this.moment = moment
    this.send = (data, replied) => utils.sendMessage(message, data, replied)
  }

  information = {
    name: 'osuset',
    aliases: [],
    description: 'Actualiza tu base de datos de osu en el bot, coloca -u para vincular tu usuario de osu, o coloca -m para cambiar tu modo de juego predeterminado',
    cooldown: 30000,
    category: 'osu',
    usage: 'osuset [acción] [id|modo]'
  }

  async execute () {
    const action = this.args[0]?.toLowerCase()
    if (action !== '-u' && action !== '-m') return this.send('Tienes que colocar una acción a realizar (-m, -u)')

    if (action === '-u') {
      const username = this.args.slice(1).join(' ')
      if (!username) return this.send('Tienes que colocar un nombre o id de usuario!')

      const user = await api(2, `users/${username}`)
      if (!user) return this.send('No se encontró ningún usuario con ese nombre/id')

      const UserDB = await schemas.OsuUser.findOne({ id: user.id })
      const DiscordUserDB = await schemas.OsuUser.findOne({ discordID: this.message.author.id })

      if (UserDB && UserDB.discordID === this.message.author.id) return this.send('Ya estás vinculado a esa cuenta!')
      if (user.discord !== this.message.author.tag) return this.send(`No te puedes vincular a esa cuenta, ya que el discord que aparece en esa cuenta es diferente al tuyo, si la cuenta te pertenece, ve a ajustes de cuenta en la página de osu y en la sección de perfil, modifica el discord a tu tag de discord actual (**${this.message.author.tag}**)`)

      if (!DiscordUserDB) {
        const newUserDB = new schemas.OsuUser({
          id: user.id,
          discordID: this.message.author.id,
          defaultMode: user.playmode
        })

        await newUserDB.save()
        return this.send(`Se vinculó con exito a la cuenta de **${user.username}**`)
      } else {
        const createButton = (id, label, style) => new this.discord.ButtonBuilder()
          .setCustomId(id)
          .setLabel(label)
          .setStyle(style)

        const buttonTrue = createButton('true', 'Si', this.discord.ButtonStyle.Success)
        const buttonFalse = createButton('false', 'No', this.discord.ButtonStyle.Danger)

        const row = new this.discord.ActionRowBuilder().addComponents(buttonTrue, buttonFalse)

        const message = await this.send({
          content: `Estás a punto de vincularte a una nueva cuenta, estás seguro de esta acción? cuenta nueva: **${user.username} (id: ${user.id})**`,
          components: [row]
        })

        const filter = (interaction) => {
          if (interaction.user.id === this.message.author.id) return true
          return interaction.reply({ content: `solamente **${this.message.author.tag}** puede hacer eso!`, ephemeral: true })
        }

        const collector = message.createMessageComponentCollector({ filter, time: 30000, max: 1, componentType: this.discord.ComponentType.Button })

        collector.on('collect', async (interaction) => {
          if (interaction.customId === 'true') {
            DiscordUserDB.id = user.id
            await DiscordUserDB.save()
            return interaction.update({ content: `Se vinculó con exito a la cuenta de **${user.username}**`, components: [] })
          } else {
            return interaction.update({ content: 'Se canceló la acción...', components: [] })
          }
        })

        collector.on('end', (collected, reason) => {
          if (reason === 'time') return message.edit({ content: 'Se acabó el tiempo...', components: [] })
        })
      }
    }

    if (action === '-m') {
      let mode = this.args[1]?.toLowerCase()
      const modes = ['osu', 'std', 'taiko', 'fruits', 'ctb', 'mania']
      if (!modes.some(m => m === mode)) return this.send('Tienes que colocar una de las 4 opciones (osu, taiko, fruits, mania)')

      switch (mode) {
        case 'std': mode = 'osu'; break
        case 'ctb': mode = 'fruits'; break
      }

      const DiscordUserDB = await schemas.OsuUser.findOne({ discordID: this.message.author.id })

      if (!DiscordUserDB) return this.send('No tienes tu cuenta vinculada, primero tienes que vincular tu cuenta con la opción -u')

      if (mode === DiscordUserDB.defaultMode) return this.send('Ya tienes ese modo de juego vinculado!')

      DiscordUserDB.defaultMode = mode
      await DiscordUserDB.save()
      return this.send(`Se cambió el modo de juego a **${mode}**`)
    }
  }
}

module.exports = OsuSet
