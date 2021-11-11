const debug = require('debug');


module.exports = {
  log: (msg) => {
    if (process.env.DEBUG) {
      debug('src:log')(msg);
    }
    else {
      console.log(msg);
    }
  },
  err: (msg) => {
    if (process.env.DEBUG) {
      debug('src:err')(msg);
    }
    else {
      console.error(msg);
    }
  }
};