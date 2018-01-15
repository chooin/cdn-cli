const OSS = require('ali-oss')
const aliyunConfig = require('../deploy-config/aliyun.config')

const aliyun = Object.create(null)

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
  console.log(`${res.res.status === 200 ? '☘  ' : '❌  '}${hasCache ? '       ' : '[Cache]'}    ${res.name}`)
}

module.exports = aliyun
