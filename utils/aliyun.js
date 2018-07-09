const OSS = require('ali-oss')
const co = require('co')

const log = require('./log')
const { env } = require('./config')

module.exports.upload = ({
  putPath,
  getPath,
  hasCache
}) => {
  return new Promise(resolve => {
    env().then(env => {
      const client = new OSS({
        region: env.oss.region,
        bucket: env.oss.bucket,
        accessKeyId: env.accessKey.id,
        accessKeySecret: env.accessKey.secret
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
        resolve()
      })
    })
  })
}
