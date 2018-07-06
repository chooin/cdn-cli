const QINIU = require('qiniu')
const co = require('co')

const log = require('./log')
const { env } = require('./config')

module.exports.upload = ({
  putPath,
  getPath,
  hasCache
}) => {
  return env().then(res => {
    console.log(1)
  })
}
