const OSS = require('ali-oss')
const log = require('./log')
const fs = require('fs')

const aliyun = Object.create(null)
const aliyunConfig = JSON.parse(fs.readFileSync(`./deploy-config/aliyun/${process.env.DEPLOY_ENV}.json`, 'utf8'))

const oss = new OSS({
  region: aliyunConfig.oss.region,
  bucket: aliyunConfig.oss.bucket,
  accessKeyId: aliyunConfig.accessKey.id,
  accessKeySecret: aliyunConfig.accessKey.secret
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
