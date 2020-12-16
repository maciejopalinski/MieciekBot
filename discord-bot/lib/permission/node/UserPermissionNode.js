const PermissionNode = require('./PermissionNode');

module.exports = class UserPermissionNode extends PermissionNode {
    
    /** @type {string} */
    user_id;

    /**
     * @param {string} name 
     * @param {string} user_id 
     * @param {number} priority
     * @param {string[]} [allowed_nodes] 
     */
    constructor(name, user_id, priority, allowed_nodes) {
        super(name, priority, allowed_nodes);
        this.user_id = user_id;
    }
}