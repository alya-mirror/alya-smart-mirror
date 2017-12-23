/* Alya Smart Mirror
 * Date time service
 *
 * By Bilal Al-Saeedi
 * MIT Licensed.
 */

'use strict';

const path = require('path');

class Helper {

  getDefaultConfigs() {
    let config;
    try {
      config = require(path.resolve('configs/config.default.json'));
    } catch(e) {
      console.error(e);
    }
    return config;
  }
}

module.exports = new Helper();
