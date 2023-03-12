require('dotenv').config()

const { REST, Routes } = require('discord.js') // REST y Routes de discord.js para registrar los comandos
const fs = require('fs') // fs para buscar los archivos de los comandos

const commands = [] // lista de comandos a registrar
const slashCommandsPath = fs.readdirSync('./slashCommands') // carpeta con las categorias de los comandos

// se itera cada categoria de commandos
for (const slashCommandsCategoryPath of slashCommandsPath) {
  const slashCommandsCategory = fs.readdirSync(`./slashCommands/${slashCommandsCategoryPath}`).filter(file => file.endsWith('.js')) // categoria actual iterada

  // se itera cada comando de la categoria
  for (const slashCommandFile of slashCommandsCategory) {
    const slashCommand = require(`./slashCommands/${slashCommandsCategoryPath}/${slashCommandFile}`) // comando actual iterado
    commands.push(slashCommand.data.toJSON()) // los datos del comando se guardan en la lista en modo de un JSON
  }
}

(async () => {
  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN)

  try {
    console.log(`Verificando actualizaciones de ${commands.length} slash commands (/) ...`)

    // se registra cada comando
    const data = await rest.put(
      Routes.applicationCommands(process.env.BOT_ID),
      { body: commands }
    )

    console.log(`Se actualizaron ${data.length} slash commands (/) ✔️`)
  } catch (error) {
    console.error(error) // si hay error lo lanza
  }
})()
