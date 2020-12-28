import * as Discord from 'discord.js';
import { Command } from './Command';

export class PermissionNodeBase {
    
    name: string;
    priority: number;
    allowed_nodes: string[];

    constructor(name: string, priority: number, allowed_nodes: string[] = [name]) {
        this.name = name;
        this.priority = priority;

        this.allowed_nodes = allowed_nodes;
    }
}

export class RolePermissionNode extends PermissionNodeBase {

    role_id: string;

    constructor(name: string, role_id: string, priority: number, allowed_nodes?: string[]) {
        super(name, priority, allowed_nodes);
        this.role_id = role_id;
    }
}

export class UserPermissionNode extends PermissionNodeBase {

    user_id: string;

    constructor(name: string, user_id: string, priority: number, allowed_nodes?: string[]) {
        super(name, priority, allowed_nodes);
        this.user_id = user_id;
    }
}

export type AnyPermissionNode = PermissionNodeBase | RolePermissionNode | UserPermissionNode;

export class PermissionNodesManager {

    guild: Discord.Guild;
    permission_nodes: AnyPermissionNode[] = [];

    constructor(guild: Discord.Guild, permission_nodes?: AnyPermissionNode[]) {
        this.guild = guild;
        
        if(permission_nodes) this.permission_nodes = permission_nodes;

        this.addNode(new RolePermissionNode('@everyone', this.guild.roles.everyone.id, 0));
        this.addNode(new UserPermissionNode('BOT_OWNER', '510925936393322497', 1000, ['USER', 'DJ', 'ADMIN', 'OWNER', 'BOT_OWNER']));
    }

    getNode(name: string) {
        return this.permission_nodes.find(value => value.name.toLowerCase() == name.toLowerCase());
    }

    addNode(node: AnyPermissionNode) {
        return this.permission_nodes.push(node);
    }

    /**
     * returns the highest permission node that user has access to
     */
    getMemberNode(user: Discord.GuildMember) {
        let current_highest = this.getNode('@everyone');

        if(this.guild.ownerID == user.id) current_highest = this.getNode('OWNER');

        this.permission_nodes.forEach(node => {
            
            if(node instanceof RolePermissionNode) {
                if(user.roles.cache.has(node.role_id) && node.priority > current_highest.priority) current_highest = node;
            }
            else if(node instanceof UserPermissionNode) {
                if(user.id == node.user_id && node.priority > current_highest.priority) current_highest = node;
            }
        });

        return current_highest;
    }

    /**
     * checks if user has permission to issue given command
     */
    hasCommandPermission(command: Command, user: Discord.GuildMember) {
        let command_node = this.getNode(command.help.permission);
        let user_node = this.getMemberNode(user);

        if(user_node.priority >= command_node.priority) return true;
        else return false;
    }
}