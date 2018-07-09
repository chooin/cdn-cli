const qiniu = require('qiniu')

const log = require('./log')
const { env } = require('./config')

module.exports.upload = ({
  putPath,
  getPath,
  hasCache
}) => {
  return new Promise(resolve => {
    env().then(env => {
      let mac = new qiniu.auth.digest.Mac(env.accessKey, env.secretKey)
      let options = {
        scope: `${env.bucket}`,
        expires: 7200
      }
      let putPolicy = new qiniu.rs.PutPolicy(options)
      if (!process.env.QINIU_UPLOAD_TOKEN) process.env.QINIU_UPLOAD_TOKEN = putPolicy.uploadToken(mac)
      let config = new qiniu.conf.Config()
      let formUploader = new qiniu.form_up.FormUploader(config)
      let putExtra = new qiniu.form_up.PutExtra()
      formUploader.putFile(
        process.env.QINIU_UPLOAD_TOKEN,
        putPath.substring(1),
        getPath,
        putExtra,
        (respErr, respBody, respInfo) => {
          log({
            status: (respInfo && respInfo.statusCode) === 200,
            getPath,
            putPath,
            hasCache
          })
          resolve()
          // if (respErr) throw respErr
          // if (respInfo.statusCode == 200) {
          //   // console.log(respBody)
          // } else {
            // console.log(respInfo.statusCode)
            // console.log(respBody)
          // }
        }
      )
    })
  })
}
