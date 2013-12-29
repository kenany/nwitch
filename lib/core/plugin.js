/**
 * Base class for plugins to inherit.
 *
 * @param {Bot} bot
 * @param {Object} metadata
 */
function Plugin(bot, metadata) {
  this.metadata = metadata;
}

/**
 * Returns plugin's name.
 *
 * @returns {String} Plugin's name.
 */
Plugin.prototype.getName = function() {
  return this.metadata.name;
};

module.exports = Plugin;