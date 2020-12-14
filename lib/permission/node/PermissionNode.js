module.exports = class PermissionNode {

    /** @type {string} */ name;
    /** @type {number} */ priority;
    /** @type {string[]} */ allowed_nodes;

    /**
     * @param {string} name 
     * @param {number} priority
     * @param {string[]} [allowed_nodes] 
     */
    constructor(name, priority, allowed_nodes) {
        this.name = name;
        this.priority = priority;
        
        if(allowed_nodes == undefined) allowed_nodes = [name];
        this.allowed_nodes = allowed_nodes;
    }
}