const { Configuration, OpenAIApi } = require('openai')
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

class Chat {
  static name = 'chat'
  static aliases = ['ask', 'question']

  constructor (message, args, utils, discord, moment) {
    this.message = message
    this.args = args
    this.utils = utils
    this.discord = discord
    this.moment = moment
    this.send = (data, replied) => utils.sendMessage(message, data, replied)
  }

  information = {
    name: 'chat',
    aliases: ['ask', 'question'],
    description: 'Hazle una pregunta o petición a chatGPT y este te responderá',
    cooldown: 10000,
    category: 'utilidad',
    usage: 'chat [pregunta]'
  }

  async execute () {
    const question = this.args.join(' ')
    if (!question) return this.send('Tienes que colocar una pregunta o petición a hacer!')

    const waiting = await this.send('Espera un momento mientras la IA piensa <a:cargando:849533646419656746>')

    const openai = new OpenAIApi(configuration)
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: question,
      max_tokens: 4000,
      temperature: 0
    })

    let text = this.discord.codeBlock(response.data.choices[0].text)
    if (response.data.choices[0].text.includes('```')) text = response.data.choices[0].text

    const embed = new this.discord.EmbedBuilder()
      .setTitle(question)
      .setDescription(text)
      .setFooter({ text: `Pregunta hecha por ${this.message.author.tag}`, iconURL: this.message.member.displayAvatarURL({ dynamic: true }) })
      .setColor(process.env.EMBED_COLOR)

    const modal = new this.discord.ModalBuilder()
      .setCustomId('modal')
      .setTitle('Nueva Pregunta')

    const newQuestion = new this.discord.TextInputBuilder()
      .setCustomId('newQuestion')
      .setLabel('Ingrese aquí su nueva pregunta o petición')
      .setMinLength(1)
      .setMaxLength(3500)
      .setStyle(this.discord.TextInputStyle.Paragraph)

    const button = new this.discord.ButtonBuilder()
      .setCustomId('button')
      .setLabel('Nueva Pregunta')
      .setStyle(this.discord.ButtonStyle.Primary)

    const modalActionRow = new this.discord.ActionRowBuilder().addComponents(newQuestion)
    const buttonActionRow = new this.discord.ActionRowBuilder().addComponents(button)

    modal.addComponents(modalActionRow)

    const message = await waiting.edit({ content: '', embeds: [embed], components: [buttonActionRow] })

    const filter = (interaction) => {
      if (interaction.user.id === this.message.author.id) return true
      return interaction.reply({ content: `solamente **${this.message.author.tag}** puede hacer eso!`, ephemeral: true })
    }

    const collector = message.createMessageComponentCollector({ filter, time: 120000, componentType: this.discord.ComponentType.Button })

    let previousQuestion = question

    collector.on('collect', async (interaction) => {
      await interaction.showModal(modal)

      const modalRequest = await interaction.awaitModalSubmit({ time: 120000, filter })
      const newQuestionResponse = modalRequest.fields.getTextInputValue('newQuestion')

      await modalRequest.update({ content: 'Espera un momento mientras la IA piensa <a:cargando:849533646419656746>', embeds: [], components: [] })

      const newResponse = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: newQuestionResponse,
        max_tokens: 4000,
        temperature: 0
      })

      let text = this.discord.codeBlock(newResponse.data.choices[0].text)
      if (newResponse.data.choices[0].text.includes('```')) text = newResponse.data.choices[0].text

      const newQuestionEmbed = new this.discord.EmbedBuilder()
        .setAuthor({ name: `Pregunta anterior: ${previousQuestion}` })
        .setTitle(newQuestionResponse)
        .setDescription(text)
        .setFooter({ text: `Pregunta hecha por ${this.message.author.tag}`, iconURL: this.message.member.displayAvatarURL({ dynamic: true }) })
        .setColor(process.env.EMBED_COLOR)

      previousQuestion = newQuestionResponse

      return message.edit({ content: '', embeds: [newQuestionEmbed], components: [buttonActionRow] })
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
