const fs = require('fs'); // fs para buscar los archivos de los comandos
const commandsPath = fs.readdirSync('./commands'); // carpeta con las categoria de comandos y sus respectivos comandos

// se exporta la función que creara el handler
module.exports = (client) => {
    // se itera cada categoria de comandos
    for (const commandsCategoryPath of commandsPath) {
        const commandsCategory = fs.readdirSync(`./commands/${commandsCategoryPath}`).filter((file) => file.endsWith(".js")); // categoria actual iterada
        
        // se itera cada comando de la categoria actual
        for (const commandFile of commandsCategory) {
            const command = require(`./commands/${commandsCategoryPath}/${commandFile}`); // comando actual iterado
            client.commands.set(command.name, command); // se guarda el comando en la colección de comandos
        }
    }
};