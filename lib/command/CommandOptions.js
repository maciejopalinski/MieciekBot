/**
 * @interface
 */
class CommandOptions {
    
    /** @type {string} */ name = "";
    /** @type {string} */ args = "";
    /** @type {string} */ description = "";
    /** @type {string[]} */ aliases = [];
    /** @type {string} */ permission = "";
}

module.exports = CommandOptions;