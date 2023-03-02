const fs = require('fs'); // fs para buscar los archivos de los comandos
const prefixCommandsPath = fs.readdirSync('./prefixCommands'); // carpeta con las categoria de comandos de prefix y sus respectivos comandos

// se exporta la función que creara el handler
module.exports = (client) => {
    // se itera cada categoria de comandos de prefix
    for (const prefixCommandsCategoryPath of prefixCommandsPath) {
        const prefixCommandsCategory = fs.readdirSync(`./prefixCommands/${prefixCommandsCategoryPath}`).filter((file) => file.endsWith(".js")); // categoria actual iterada
        
        // se itera cada comando de la categoria actual
        for (const prefixCommandFile of prefixCommandsCategory) {
            const command = require(`./prefixCommands/${prefixCommandsCategoryPath}/${prefixCommandFile}`); // comando actual iterado
            client.commands.set(command.name, command); // se guarda el comando en la colección de comandos
        }
    }
};