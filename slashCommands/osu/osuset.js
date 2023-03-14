const { SlashCommandBuilder } = require('discord.js')
const schemas = require('../../utils/schemas')
const api = require('../../utils/osuApi')

class OsuSet {
  static data = new SlashCommandBuilder()
    .setName('osu_set')
    .setDescription('Actualiza tu base de datos de osu en el bot')
    .setDMPermission(false)
    .addSubcommand(subcommand => subcommand
      .setName('user')
      .setDescription('Vincula tu cuenta de discord a tu cuenta de osu')
      .addStringOption(option => option
        .setName('user')
        .setDescription('El nombre de usuario o id de osu')
        .setRequired(true)
      )
    )
    .addSubcommand(subcommand => subcommand
      .setName('mode')
      .setDescription('Cambia tu modo de juego de osu predeterminado en el bot')
      .addStringOption(option => option
        .setName('mode')
        .setDescription('El modo de juego a cambiar')
        .setRequired(true)
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
    name: 'osuset',
    description: 'Actualiza tu base de datos de osu en el bot',
    cooldown: 30000,
    category: 'osu',
    usage: '</osu_set user:1084323278304333834> </osu_set mode:1084323278304333834>'
  }

  async execute () {
    if (this.interaction.options.getSubcommand() === 'user') {
      const username = this.interaction.options.getString('user')

      const user = await api(2, `users/${username}`)
      if (!user) return this.interaction.reply({ content: 'No se encontró ningún usuario con ese nombre/id', ephemeral: true })

      const UserDB = await schemas.OsuUser.findOne({ id: user.id })
      const DiscordUserDB = await schemas.OsuUser.findOne({ discordID: this.interaction.user.id })

      if (UserDB && UserDB.discordID === this.interaction.user.id) return this.interaction.reply({ content: 'Ya estás vinculado a esa cuenta!', ephemeral: true })
      if (user.discord !== this.interaction.user.tag) return this.interaction.reply({ content: `No te puedes vincular a esa cuenta, ya que el discord que aparece en esa cuenta es diferente al tuyo, si la cuenta te pertenece, ve a ajustes de cuenta en la pagina de osu y en la sección de perfil, modifica el discord a tu tag de discord actual (**${this.interaction.user.tag}**)`, ephemeral: true })

      if (!DiscordUserDB) {
        const newUserDB = new schemas.OsuUser({
          id: user.id,
          discordID: this.interaction.user.id,
          defaultMode: user.playmode
        })

        await newUserDB.save()
        return this.interaction.reply(`Se vinculó con exito a la cuenta de **${user.username} (id: ${user.id})**`)
      } else {
        const createButton = (id, label, style) => new this.discord.ButtonBuilder()
          .setCustomId(id)
          .setLabel(label)
          .setStyle(style)

        const buttonTrue = createButton('true', 'Si', this.discord.ButtonStyle.Success)
        const buttonFalse = createButton('false', 'No', this.discord.ButtonStyle.Danger)

        const row = new this.discord.ActionRowBuilder().addComponents(buttonTrue, buttonFalse)

        const message = await this.interaction.reply({
          content: `Estás a punto de vincularte a una nueva cuenta, estás seguro de esta acción? cuenta nueva: **${user.username} (id: ${user.id})**`,
          components: [row]
        })

        const filter = (interaction) => {
          if (interaction.user.id === this.interaction.user.id) return true
          return interaction.reply({ content: `solamente **${this.interaction.user.tag}** puede hacer eso!`, ephemeral: true })
        }

        const collector = message.createMessageComponentCollector({ filter, time: 10000, max: 1, componentType: this.discord.ComponentType.Button })

        collector.on('collect', async (interaction) => {
          if (interaction.customId === 'true') {
            DiscordUserDB.id = user.id
            await DiscordUserDB.save()
            return interaction.update({ content: `Se vinculó con exito a la cuenta de **${user.username} (id: ${user.id})**`, components: [] })
          } else {
            return interaction.update({ content: 'Se canceló la acción...', components: [] })
          }
        })

        collector.on('end', (collected, reason) => {
          if (reason === 'time') return message.update({ content: 'Se acabó el tiempo...', components: [] })
        })
      }
    }

    if (this.interaction.options.getSubcommand() === 'mode') {
      const mode = this.interaction.options.getString('mode')
      const DiscordUserDB = await schemas.OsuUser.findOne({ discordID: this.interaction.user.id })

      if (!DiscordUserDB) return this.interaction.reply({ content: 'No tienes tu cuenta vinculada, primero tienes que vincularla con el comando </osu_set user:1084323278304333834>', ephemeral: true })

      if (mode === DiscordUserDB.defaultMode) return this.interaction.reply({ content: 'Ya tienes ese modo de juego vinculado!', ephemeral: true })

      DiscordUserDB.defaultMode = mode
      await DiscordUserDB.save()
      return this.interaction.reply(`Se cambió el modo de juego a **${mode}**`)
    }
  }
}

module.exports = OsuSet
