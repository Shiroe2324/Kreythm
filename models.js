// Modelo de un comando de prefix
class Command {
    static name = ''; // nombre del comando
    static aliases = []; // los aliases del comando

    // constructor cuando se inicializa el comando
    constructor(message, args, utils, discord) {
        this.message = message; // el mensaje que envió el usuario
        this.args = args; // los argumentos del mensaje
        this.utils = utils; // las funciones de ayuda
        this.discord = discord; // la libreria de discord.js
    }

    // función de ejecución del comando
    async execute () {
        
    }
}


// Modelo de un slash command
const { SlashCommandBuilder } = require('discord.js'); // metodo de constructor de slash commands

class SlashCommand {
    // constructor del slash command
    static data = new SlashCommandBuilder()
        .setName('')
        .setDescription('')
        .setDMPermission(false)
        // ... opciones adicionales de los slash commands

    // constructor cuando se inicializa el comando
    constructor(interaction, utils, discord) {
        this.interaction = interaction; // comando hecho
        this.utils = utils; // las funciones de ayuda
        this.discord = discord; // la libreria del discord.js
    }

    // función de ejecución del comando
    async execute() {

    }
}