
const log4js = require('log4js');

log4js.configure({
  appenders: { userLog: { type: 'file', filename: './logs/log-file.log' } },
  categories: { default: { appenders: ['userLog'], level: 'error' } }
});

const loggerObj = log4js.getLogger('userLog');


const logger = {
  log: (level, field, msg) => {
    let textToWrite = `Logging field: ${field}: ${JSON.stringify(msg)}`;

    loggerObj.level = level; 
    if (level === 'debug') {
      loggerObj.debug(textToWrite);

    } else if (level == 'info') {
      loggerObj.info(textToWrite);

    } else if (level == 'error') {
      loggerObj.error(textToWrite);
    }
  }
};

module.exports = logger;
