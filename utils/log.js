const chalk = require('chalk')

module.exports = ({
  status,
  hasCache,
  putPath
}) => {
  if (status) {
    status = chalk.green(' - Completed ')
  } else {
    status = chalk.red(' - Failed')
  }
  if (hasCache) {
    hasCache = chalk.yellow('[No-cache]')
  } else {
    hasCache = '          '
  }
  console.log(`${status} ${hasCache} ${putPath}`)
}
