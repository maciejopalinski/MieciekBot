import { GuildMember } from 'discord.js';

export type PermissionNodeName = '@everyone' | 'MUTE' | 'USER' | 'DJ' | 'ADMIN' | 'OWNER' | 'BOT_OWNER';

export class PermissionNodeBase {

    name: PermissionNodeName;
    priority: number;
    allowed_nodes: PermissionNodeName[];

    constructor(name: PermissionNodeName, priority: number, allowed_nodes: PermissionNodeName[] = [name]) {
        this.name = name;
        this.priority = priority;
        this.allowed_nodes = allowed_nodes;
    }

    hasPermission(user: GuildMember) {}
}

export class RolePermissionNode extends PermissionNodeBase {

    role_id: string;

    constructor(name: PermissionNodeName, role_id: string, priority: number, allowed_nodes?: PermissionNodeName[]) {
        super(name, priority, allowed_nodes);
        this.role_id = role_id;
    }

    hasPermission(user: GuildMember) {
        return user.roles.cache.has(this.role_id);
    }
}

export class UserPermissionNode extends PermissionNodeBase {

    user_id: string;

    constructor(name: PermissionNodeName, user_id: string, priority: number, allowed_nodes?: PermissionNodeName[]) {
        super(name, priority, allowed_nodes);
        this.user_id = user_id;
    }

    hasPermission(user: GuildMember) {
        return user.id == this.user_id;
    }
}

export type AnyPermissionNode = PermissionNodeBase | RolePermissionNode | UserPermissionNode;