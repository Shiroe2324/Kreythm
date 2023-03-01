class Ping {
    static name = 'ping'; // nombre del comando
    static aliases = ['pong']; // los aliases del comando

    // constructor cuando se inicializa el comando
    constructor(msg, args, utils) {
        this.msg = msg; // el mensaje que envió el usuario
        this.args = args; // los argumentos del mensaje
        this.utils = utils; // las funciones de ayuda
    }

    // función de ejecución del comando
    async execute () {
        return await this.msg.reply('pong!'); // se envia un mensaje que contiene 'pong!'
    }
}

module.exports = Ping; // se exporta el comando