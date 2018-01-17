const OSS = require('ali-oss')
const log = require('./log')
const fs = require('fs')

const aliyun = Object.create(null)
let config

try {
  config = JSON.parse(fs.readFileSync(`./deploy-config/aliyun/${process.env.DEPLOY_ENV}.json`, 'utf8'))
} catch (e) {
  throw `解析配置文件出错`
}

const oss = new OSS({
  region: config.oss.region,
  bucket: config.oss.bucket,
  accessKeyId: config.accessKey.id,
  accessKeySecret: config.accessKey.secret
})

aliyun.upload = function* ({
  putPath,
  getPath,
  hasCache
}) {
  let res = yield oss.put(
    putPath,
    getPath,
    hasCache
      ? { headers: { 'Cache-Control': 'no-cache, private' } }
      : {}
  )
  log({
    status: res.res.status === 200,
    hasCache,
    putPath: res.name
  })
}

module.exports = aliyun
