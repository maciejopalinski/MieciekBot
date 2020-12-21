const PermissionNode = require('./PermissionNode');

module.exports = class RolePermissionNode extends PermissionNode {

    /** @type {string} */
    role_id;
    
    /**
     * @param {string} name 
     * @param {string} role_id 
     * @param {number} priority
     * @param {string[]} [allowed_nodes] 
     */
    constructor(name, role_id, priority, allowed_nodes) {
        super(name, priority, allowed_nodes);
        this.role_id = role_id;
    }
}