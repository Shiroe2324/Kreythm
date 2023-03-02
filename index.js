require('dotenv').config(); // variables de entorno
console.log('Iniciando el bot ...');

// inicio del bot
const Discord = require('discord.js'); // discord.js
const { Client, Events, ChannelType, Collection } = Discord; // métodos de discors.js
const client = new Client({ intents: 3276799 }); // cliente de discord
const prefix = process.env.PREFIX; // variable de entorno del prefix del bot
const handler = require('./handler'); // archivo con la función handler del bot
const utils = require('./utils'); // archivo con las funciones de utilidad

client.commands = new Collection(); // colección donde se guardan los comandos
client.slashCommands = new Collection(); // colección donde se guardan los slash commands

handler(client); // se ejecuta la función handler

// evento cuando el bot se inicia
client.once(Events.ClientReady, () => {
	console.log(`${client.user.tag} está listo ✔️`);
});

// evento cuando se envia un mensaje a un canal
client.on(Events.MessageCreate, (message) => {
	if (message.author.bot) return; // retorna si el autor es bot
	if (message.channel.type !== ChannelType.GuildText) return; // retorna si el canal al que se envió mensaje no es un canal de un servidor
	if (!message.content.toLowerCase().startsWith(prefix)) return; // retorna si el mensaje no inicia con el prefix

	const args = message.content.slice(prefix.length).trim().split(/\s+/g); // se dividen los argumentos del mensaje por cada espacio en blanco
	const commandName = args.shift().toLowerCase(); // se quita el primer argumento de los argumentos y se convierte en el nombre del comando

	// se busca en la colección de comandos el nombre del comando por medio del propio nombre o de algún alias
	const searchCommand = message.client.commands.get(commandName) || message.client.commands.find((cmd) => cmd.aliases.includes(commandName));
	if (!searchCommand) return; // retorna si no encuentra ningún comando con ese nombre o alias
    
	const command = new searchCommand(message, args, utils, Discord); // se inicializa el comando encontrado

	// se ejecuta el comando y si encuentra algún error lo lanza
	command.execute().catch(error => {
		console.error(error);
		message.channel.send(`Ocurrió un error al ejecutar el comando: **__${error}__**`);
	});
});

// evento cuando se crea una nueva interacción con el bot
client.on(Events.InteractionCreate, (interaction) => {
	// verifica si la interacción es un comando
	if (interaction.isChatInputCommand()) {
		const commandData = interaction.client.slashCommands.get(interaction.commandName); // los datos del comando ingresado
		if (!commandData) return; // retorna si no hay datos de ese comando

		const command = new commandData(interaction, utils, Discord); // se inicializa el comando

		// se ejecuta el comando y si encuentra algún error lo lanza
		command.execute().catch(error => {
			console.error(error);
			interaction.reply({ content: `Ocurrió un error al ejecutar el comando: **__${error}__**`, ephemeral: true });
		});
	}
})

// se inicia sesion en el bot
client.login(process.env.TOKEN);