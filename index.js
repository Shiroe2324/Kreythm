require('dotenv').config(); // variables de entorno

// inicio del bot
const { Client, Events, ChannelType, Collection } = require('discord.js'); // discord.js
const client = new Client({ intents: 3276799 }); // cliente de discord
const prefix = process.env.PREFIX; // variable de entorno del prefix del bot
const handler = require('./handler'); // archivo con la función handler del bot
const utils = require('./utils'); // archivo con las funciones de utilidad

client.commands = new Collection(); // colección donde se guardan los comandos

handler(client); // se ejecuta la función handler

// evento cuando el bot se inicia
client.once(Events.ClientReady, () => {
	console.log('ready');
});

// evento cuando se envia un mensaje a un canal
client.on(Events.MessageCreate, (msg) => {
	if (msg.author.bot) return; // retorna si el autor es bot
	if (msg.channel.type !== ChannelType.GuildText) return; // retorna si el canal al que se envió mensaje no es un canal de un servidor
	if (!msg.content.toLowerCase().startsWith(prefix)) return; // retorna si el mensaje no inicia con el prefix

	const args = msg.content.slice(prefix.length).trim().split(/\s+/g); // se dividen los argumentos del mensaje por cada espacio en blanco
	const commandName = args.shift().toLowerCase(); // se quita el primer argumento de los argumentos y se convierte en el nombre del comando

	// se busca en la colección de comandos el nombre del comando por medio del propio nombre o de algún alias
	const searchCommand = msg.client.commands.get(commandName) || msg.client.commands.find((cmd) => cmd.aliases.includes(commandName));
	if (!searchCommand) return; // retorna si no encuentra ningún comando con ese nombre o alias

	console.log(searchCommand.name)
	const command = new searchCommand(msg, args, utils); // se inicializa el comando encontrado
	console.log(command.name)

	// se ejecuta el comando y si encuentra algún error lo lanza
	command.execute().catch(error => {
		console.log(error);
		msg.channel.send(error);
	});
});

// se inicia sesion en el bot
client.login(process.env.TOKEN);