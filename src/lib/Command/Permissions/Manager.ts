import { Guild, GuildMember } from 'discord.js';
import { Command } from '../Command';
import { AnyPermissionNode, PermissionNodeName, RolePermissionNode, UserPermissionNode } from './Nodes';

export class PermissionManager {

    guild: Guild;
    nodes: AnyPermissionNode[] = [];

    constructor(guild: Guild, nodes: AnyPermissionNode[] = []) {
        this.guild = guild;
        this.nodes = nodes;

        this.addNode(new RolePermissionNode('@everyone', this.guild.id, 0));
        this.addNode(new UserPermissionNode('BOT_OWNER', '510925936393322497', 1000, ['USER', 'DJ', 'ADMIN', 'OWNER', 'BOT_OWNER']));
    }

    getNode(name: PermissionNodeName) {
        return this.nodes.find(v => v.name.toLowerCase() == name.toLowerCase());
    }

    getNodeRole(name: PermissionNodeName) {
        let node = this.getNode(name);
        if (node instanceof RolePermissionNode) {
            return this.guild.roles.cache.get(node.role_id);
        }
        else return null;
    }

    addNode(node: AnyPermissionNode) {
        if (!this.nodes.some(v => v.name == node.name)) {
            this.nodes.push(node);
            this.nodes.sort((a, b) => a.priority - b.priority);
        }
    }

    /**
     * returns the highest permission node that user has access to
     */
    getMemberNode(user: GuildMember) {
        let nodes = this.nodes.filter(v => v.hasPermission(user));
        let highest = nodes[nodes.length - 1];
        return highest;
    }

    /**
     * checks if user has permission to issue given command
     */
    hasCommandPermission(command: Command, user: GuildMember) {
        let command_node = this.getNode(command.help.permission);
        let user_node = this.getMemberNode(user);
        return user_node.priority >= command_node.priority;
    }
}