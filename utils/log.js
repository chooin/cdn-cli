const chalk = require('chalk')

module.exports = ({
  status,
  hasCache,
  getPath,
  putPath
}) => {
  if (status) {
    status = chalk.green(('- Completed').padStart(12))
  } else {
    status = chalk.red('- Failed  '.padStart(12))
  }
  if (hasCache) {
    hasCache = chalk.yellow('[No-cache]'.padStart(12))
  } else {
    hasCache = '[Cache]'.padStart(12)
  }
  console.log(`${status}   ${hasCache}   ${getPath} ${chalk.yellow('->')} ${putPath}`)
}
