const OSS = require('ali-oss')
const co = require('co')

const log = require('./log')
const { env } = require('./config')

module.exports.upload = ({
  putPath,
  getPath,
  hasCache
}) => {
  return env().then(res => {
    let client = new OSS({
      region: res.oss.region,
      bucket: res.oss.bucket,
      accessKeyId: res.accessKey.id,
      accessKeySecret: res.accessKey.secret
    })
    co(function* () {
      let { res } = yield client.put(
        putPath,
        getPath,
        hasCache
          ? {
              headers: {
                'Cache-Control': 'no-cache, private'
              }
            }
          : {}
      )
      log({
        status: res.status === 200,
        getPath,
        putPath,
        hasCache
      })
    })
  })
}
