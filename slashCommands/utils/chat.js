const { SlashCommandBuilder } = require('discord.js')
const { Configuration, OpenAIApi } = require('openai')
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

class Chat {
  static data = new SlashCommandBuilder()
    .setName('chat')
    .setDescription('Pregunta, chatea, o pide a chatGPT cualquier cosa')
    .setDMPermission(false)

  constructor (interaction, utils, discord, moment) {
    this.interaction = interaction
    this.utils = utils
    this.discord = discord
    this.moment = moment
  }

  information = {
    name: 'chat',
    description: 'Hazle una pregunta o petición a chatGPT y este te responderá',
    cooldown: 10000,
    category: 'utilidad',
    usage: '</chat:1085003248970244166>'
  }

  async execute () {
    const modal = new this.discord.ModalBuilder()
      .setCustomId('modal')
      .setTitle('Nueva Pregunta')

    const newQuestion = new this.discord.TextInputBuilder()
      .setCustomId('newQuestion')
      .setLabel('Ingrese aquí su nueva pregunta o petición')
      .setMinLength(1)
      .setMaxLength(3500)
      .setStyle(this.discord.TextInputStyle.Paragraph)

    const modalActionRow = new this.discord.ActionRowBuilder().addComponents(newQuestion)
    modal.addComponents(modalActionRow)

    await this.interaction.showModal(modal)

    const filter = (interaction) => {
      if (interaction.user.id === this.interaction.user.id) return true
      return interaction.reply({ content: `solamente **${this.interaction.user.tag}** puede hacer eso!`, ephemeral: true })
    }

    const modalRequest = await this.interaction.awaitModalSubmit({ time: 120000, filter })
    const question = modalRequest.fields.getTextInputValue('newQuestion')

    await modalRequest.deferReply()

    const openai = new OpenAIApi(configuration)
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: question,
      max_tokens: 4000,
      temperature: 0
    })

    let text = this.discord.codeBlock(response.data.choices[0].text.slice(0, 4080))
    if (response.data.choices[0].text.includes('```')) text = response.data.choices[0].text.slice(0, 4080)

    const embed = new this.discord.EmbedBuilder()
      .setTitle(question)
      .setDescription(text)
      .setFooter({ text: `Pregunta hecha por ${this.interaction.user.tag}`, iconURL: this.interaction.member.displayAvatarURL({ dynamic: true }) })
      .setColor(process.env.EMBED_COLOR)

    const button = new this.discord.ButtonBuilder()
      .setCustomId('chatButton')
      .setLabel('Nueva Pregunta')
      .setStyle(this.discord.ButtonStyle.Primary)

    const buttonActionRow = new this.discord.ActionRowBuilder().addComponents(button)

    const message = await modalRequest.editReply({ content: '', embeds: [embed], components: [buttonActionRow] })

    const collector = message.channel.createMessageComponentCollector({ filter, time: 120000, componentType: this.discord.ComponentType.Button })

    let previousQuestion = question

    collector.on('collect', async (interaction) => {
      if (interaction.customId === 'chatButton') {
        await interaction.showModal(modal)

        const modalRequest = await interaction.awaitModalSubmit({ time: 120000, filter })
        const newQuestionResponse = modalRequest.fields.getTextInputValue('newQuestion')

        await modalRequest.deferReply({ ephemeral: true })

        const newResponse = await openai.createCompletion({
          model: 'text-davinci-003',
          prompt: newQuestionResponse,
          max_tokens: 4000,
          temperature: 0
        })

        let text = this.discord.codeBlock(newResponse.data.choices[0].text.slice(0, 4080))
        if (newResponse.data.choices[0].text.includes('```')) text = newResponse.data.choices[0].text.slice(0, 4080)

        const newQuestionEmbed = new this.discord.EmbedBuilder()
          .setAuthor({ name: `Pregunta anterior: ${previousQuestion}` })
          .setTitle(newQuestionResponse)
          .setDescription(text)
          .setFooter({ text: `Pregunta hecha por ${this.interaction.user.tag}`, iconURL: this.interaction.member.displayAvatarURL({ dynamic: true }) })
          .setColor(process.env.EMBED_COLOR)

        previousQuestion = newQuestionResponse

        return modalRequest.editReply({ content: '', embeds: [newQuestionEmbed], components: [buttonActionRow] })
      }
    })

    collector.on('end', (collected, reason) => {
      if (reason === 'time') {
        const quoteEmbed = this.discord.EmbedBuilder.from(message.embeds[0])
        message.edit({ embeds: [quoteEmbed], components: [] })
      }
    })
  }
}

module.exports = Chat
