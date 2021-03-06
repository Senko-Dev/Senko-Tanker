module.exports = {
    name: 'help',
    description: 'List all of my commands or info about a specific command.',
    category: 'Bot',
    aliases: ['commands'],
    usage: '[command name]',
    cooldown: 5,
    execute(message, args, client, Discord) {
        const data = [];
        const { commands } = message.client;


        if (!args.length) {
            const commandListEmbed = new Discord.MessageEmbed()
                .setColor(client.colors.green)
                .setTitle('Help')
                .setDescription(`\nYou can send \`${client.config.prefix}help [command name]\` to get info on a specific command!`)
                .addFields(
                    { name: 'Commands', value: commands.map(command => command.name).join(', ') }
                );

            data.push(commandListEmbed);

            return message.author.send(data, { split: true })
                .then(() => {
                    if (message.channel.type === 'dm') return;
                    message.reply('I\'ve sent you a DM with all my commands!');
                })
                .catch(error => {
                    console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                    message.reply('It seems like I can\'t DM you! Do you have DMs disabled?');
                });
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply({
                embed: {
                    color: client.colors.red,
                    title: 'Not found',
                    description: 'That command does not exist!',
                },
            });
        }

        let commandDetailEmbed = new Discord.MessageEmbed()
            .setColor(client.colors.green)
            .setTitle('Help for requested command')
            .setDescription(`Previewing details on a specific command.`)
            .addFields(
                { name: 'Name', value: command.name },
                { name: 'Description', value: command.description || 'No description' },
                { name: 'Category', value: command.category || 'No Category' },
                { name: '\u200B', value: '\u200B' },
                { name: 'Cooldown', value: `${command.cooldown || 3} second(s)` },
                { name: 'Usage', value: `${client.config.prefix}${command.name} ${command.usage}` || 'No usage' },
                { name: 'Permissions', value: command.permssions || 'Anyone can use this command' },
                { name: 'Usable in DMs', value: command.guildOnly ? 'No' : 'Yes' }
            )
            .setTimestamp()
            .setAuthor(client.user.username, client.user.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
            .setFooter('[] means optional, <> means required. Do not type these out.');

        data.push(commandDetailEmbed);
        message.author.send(data, { split: true })  
            .then(() => {
                if (message.channel.type === 'dm') return;
                message.reply(`I\'ve sent you a DM with info on ${name}!`);
            })
            .catch(error => {
                console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                message.reply('It seems like I can\'t DM you! Do you have DMs disabled?');
            });
    },
};