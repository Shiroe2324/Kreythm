const fs = require('fs') // fs para buscar los archivos de los comandos
const prefixCommandsPath = fs.readdirSync('./prefixCommands') // carpeta con las categorias de comandos de prefix y sus respectivos comandos
const multiNameCommandsPath = fs.readdirSync('./multiNameCommands') // carpeta con las categorias de comandos con multiples nombres y sus respectivos comandos
const slashCommandsPath = fs.readdirSync('./slashCommands') // carpeta con las categorias de slash commands y sus respectivos comandos

// se exporta la función que creara el handler
module.exports = (client) => {
  // se itera cada categoria de comandos de prefix
  for (const prefixCommandsCategoryPath of prefixCommandsPath) {
    const prefixCommandsCategory = fs.readdirSync(`./prefixCommands/${prefixCommandsCategoryPath}`).filter((file) => file.endsWith('.js')) // categoria actual iterada

    // se itera cada comando de la categoria actual
    for (const prefixCommandFile of prefixCommandsCategory) {
      const command = require(`./prefixCommands/${prefixCommandsCategoryPath}/${prefixCommandFile}`) // comando actual iterado
      client.commands.set(command.name, command) // se guarda el comando en la colección de comandos
    }
  }
  // se itera cada categoria de comandos con multiples nombres
  for (const multiNameCommandFile of multiNameCommandsPath) {
    const command = require(`./multiNameCommands/${multiNameCommandFile}`) // comando actual iterado
    client.multiNameCommands.set(command.names, command) // se guarda el comando en la colección de comandos
  }
  // se itera cada categoria de slash command
  for (const slashCommandsCategoryPath of slashCommandsPath) {
    const slashCommandsCategory = fs.readdirSync(`./slashCommands/${slashCommandsCategoryPath}`).filter(file => file.endsWith('.js')) // categoria actual iterada

    // se itera cada comando de la categoria actual
    for (const slashCommandFile of slashCommandsCategory) {
      const slashCommand = require(`./slashCommands/${slashCommandsCategoryPath}/${slashCommandFile}`) // comando actual iterado
      client.slashCommands.set(slashCommand.data.name, slashCommand) // se guarda cada comando en la colección de slash commands
    }
  }
}
