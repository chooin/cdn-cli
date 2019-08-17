const chalk = require('chalk')

module.exports = ({
  status,
  hasCache,
  getPath,
  putPath
}) => {
  status = status ? ` - ${chalk.green(('[成功]').padEnd(16))}` : ` - ${chalk.red('[失败]'.padEnd(16))}`
  hasCache = hasCache ? chalk.yellow('[不支持]'.padEnd(15)) : '[支持]'.padEnd(16)

  if (process.stdout.columns > 160) {
    console.log(`${status}${hasCache}${getPath}${chalk.yellow(' -> ')}${putPath}`)
  } else {
    console.log(`${status}${hasCache}${putPath}`)
  }
}
