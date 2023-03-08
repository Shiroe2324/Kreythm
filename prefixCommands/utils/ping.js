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
        const date = Date.now();
        const message = await this.message.channel.send('calculando...');

        return message.edit(`El ping actualmente es de: **${Date.now() - date}ms**`);
    }
}

module.exports = Ping;