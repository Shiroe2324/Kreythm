// Modelo de un comando de prefix
class Command {
    static name = ''; // nombre del comando
    static aliases = []; // los aliases del comando

    // constructor cuando se inicializa el comando
    constructor(msg, args, utils, discord) {
        this.msg = msg; // el mensaje que envió el usuario
        this.args = args; // los argumentos del mensaje
        this.utils = utils; // las funciones de ayuda
        this.discord = discord; // la libreria de discordjs
    }

    // función de ejecución del comando
    async execute () {
        
    }
}

module.exports = Command; // se exporta el comando