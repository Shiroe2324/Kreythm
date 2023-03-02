const { inspect } = require('util');

class Eval {
    static name = 'eval'; // nombre del comando
    static aliases = ['e']; // los aliases del comando

    // constructor cuando se inicializa el comando
    constructor(message, args, utils, discord) {
        this.message = message; // el mensaje que envió el usuario
        this.args = args; // los argumentos del mensaje
        this.utils = utils; // las funciones de ayuda
        this.discord = discord; // la libreria de discordjs
    }

    // función de ejecución del comando
    async execute () {
        if (!process.env.OWNERS.split(' ').some(owner => owner === this.message.author.id)) return; // retorna si el autor del mensaje no es owner del bot

        const code = this.args.join(' '); // codigo ingresado a ejecutar
        if (!code) return; // retorna si no se ingresó codigo

        try {
            const evaled = await eval(code); // se evalua el codigo
            const result = inspect(evaled, { depth: 0 }); // y se inspecciona para una mejor visualización

            this.message.channel.send(this.discord.codeBlock('js', result)); // se envía el resultado del codigo
        } catch (err) {
            this.message.channel.send(this.discord.codeBlock('js', err)); // se envía si hubo un error al ejecutar el codigo
        }
    }
}

module.exports = Eval; // se exporta el comando