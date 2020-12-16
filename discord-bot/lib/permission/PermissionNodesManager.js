const Discord = require('discord.js');
const Command = require('../command/Command');

const RolePermissionNode = require('./node/RolePermissionNode');
const UserPermissionNode = require('./node/UserPermissionNode');

module.exports = class PermissionNodesManager {

    /** @type {Discord.Guild} */
    guild;
    /** @type {Array<RolePermissionNode|UserPermissionNode>} */
    permission_nodes = [];

    /**
     * @param {Discord.Guild} guild 
     * @param {Array<RolePermissionNode|UserPermissionNode>} [permission_nodes]
     */
    constructor(guild, permission_nodes) {
        this.guild = guild;
        if(permission_nodes !== undefined) this.permission_nodes = permission_nodes;

        this.addNode(new RolePermissionNode('@everyone', this.guild.roles.everyone.id, 0));
        this.addNode(new UserPermissionNode('BOT_OWNER', '510925936393322497', 1000, ['USER', 'DJ', 'ADMIN', 'OWNER', 'BOT_OWNER']));
    }

    /** @param {string} name */
    getNode(name) {
        return this.permission_nodes.find(value => value.name.toLowerCase() == name.toLowerCase());
    }

    /** @param {RolePermissionNode|UserPermissionNode} node */
    addNode(node) {
        this.permission_nodes.push(node);
    }

    /** 
     * returns the highest permission node that user has access to
     * @param {Discord.GuildMember} user
     */
    getMemberNode(user) {
        let current_highest = this.getNode('@everyone');
        if(this.guild.ownerID == user.id) current_highest = this.getNode('OWNER');

        this.permission_nodes.forEach(node => {
            if(node instanceof RolePermissionNode) {
                if(user.roles.cache.has(node.role_id) && node.priority > current_highest.priority) current_highest = node;
            } else if(node instanceof UserPermissionNode) {
                if(user.id == node.user_id && node.priority > current_highest.priority) current_highest = node;
            }
        });

        return current_highest;
    }

    /**
     * checks if user has permission to issue given command
     * @param {Command} command
     * @param {Discord.GuildMember} user
     */
    hasCommandPermission(command, user) {
        let command_node = this.getNode(command.help.permission);
        let user_node = this.getMemberNode(user);

        if(user_node.priority >= command_node.priority) return true;
        else return false;
    }
}