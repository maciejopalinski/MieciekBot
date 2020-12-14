const { Message } = require('discord.js');
const Client = require('../client/Client');
const CommandOptions = require('./CommandOptions');

class Command {

    /** 
     * @param {Client} bot
     * @param {Message} msg
     * @param {string[]} args
     * 
     * @returns {Promise<any>}
     */
    async execute(bot, msg, args) {}

    /** @type {CommandOptions} */ help;
    /** @type {string[]} */ args_array = [];
    /** @type {string} */ category = "";
    /** @type {string} */ path = "";

    error = {};

    /** @param {CommandOptions} help */
    setHelp(help) {
        this.help = help;
        this.args_array = this.help.args.split(' ');
    }
}

module.exports = Command;