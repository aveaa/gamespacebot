const Discord = require('discord.js');
const func = require('../../func.js');
const request = require('request');

module.exports.info = {
    command: '^(mute|(за)?мути?т?ь?)$',
    name: 'mute',
    lang: {
        'ru': {
            description: 'Команда для блокировки пользователю возможности писать в чат'
        }
    },
    access: {
        type: 'right',
        params: 'MANAGE_MESSAGES',
    }
};

module.exports.run = async function (client, message, command, args, info) {
    message.delete();
    let member = message.mentions.members.first();
    if (!member) return message.channel.send(func.generateErrorMessage('ru', client, 'Произошла ошибка!', 'Данный пользователь не является участником сервера!'));
    args.shift();
    let reason = args.join();
    let reasontext = ' по причине `'+reason+'`';
    if (!reason) {
        reason = 'Причина не указана';
        reasontext = ';'
    }
    func.confirm(client, message, `Вы уверены, что хотите замутить пользователя \`${member.displayName}#${member.user.discriminator}\`?`, () => {
        request(`http://${process.env.SITE_DOMAIN}/?action=mute&moderator=${message.author.id}&user=${member.user.id}&secret=${encodeURIComponent(process.env.SECRET_KEY)}`, (err, response, data) => {
            // noinspection EqualityComparisonWithCoercionJS
            if (err) {  client.channels.get(client.log_channels.errors).send(func.generateErrorMessage('ru', client, `Произошла ошибка при выдаче предупреждения ${message.author} -> ${member}`, err.toString())); return message.channel.send(func.generateErrorMessage('ru', client, 'Произошла ошибка!', 'Не удалось выдать варн.'));}
            message.channel.send(`Пользователь ${member} получил предупреждение${reasontext} от модератора ${message.author}`)
        })
    })
};