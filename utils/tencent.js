const COS = require('cos-nodejs-sdk-v5')
const co = require('co')
const fs = require('fs')

const log = require('./log')
const { env } = require('./config')

module.exports.upload = ({
  putPath,
  getPath,
  hasCache
}) => {
  return new Promise(resolve => {
    env().then(env => {
      const client = new COS({
        AppId: env.appid,
        SecretId: env.secretId,
        SecretKey: env.secretKey
      })
      client.putObject({
        Bucket: env.bucket,
        Region: env.region,
        Key: putPath,
        Body: fs.createReadStream(getPath),
        ContentLength: fs.statSync(getPath).size,
        CacheControl: hasCache
          ? 'no-cache, private'
          : undefined
      }, (err, data) => {
        log({
          status: (data && data.statusCode) === 200,
          getPath,
          putPath,
          hasCache
        })
        resolve()
      })
    })
  })
}