class Ping {
    static name = 'ping';
    static aliases = ['pong'];

    constructor(message, args, utils, discord) {
        this.message = message;
        this.args = args;
        this.utils = utils;
        this.discord = discord;
    }

    async execute () {
        return await this.message.reply('pong!'); // se envia un mensaje que contiene 'pong!'
    }
}

module.exports = Ping;