const chalk = require('chalk')

module.exports = ({
  status,
  hasCache,
  getPath,
  putPath
}) => {
  if (status) {
    status = ` - ${chalk.green(('Completed').padEnd(9))}`
  } else {
    status = ` - ${chalk.red('Failed  '.padEnd(9))}`
  }
  if (hasCache) {
    hasCache = chalk.yellow('[No-cache]'.padStart(12))
  } else {
    hasCache = '[Cache]'.padStart(12)
  }
  if (process.stdout.columns > 160) {
    console.log(`${status}   ${hasCache}   ${getPath} ${chalk.yellow('->')} ${putPath}`)
  } else {
    console.log(`${status}   ${hasCache}   ${putPath}`)
  }
}
