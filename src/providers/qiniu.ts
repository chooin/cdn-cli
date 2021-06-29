import qiniu from 'qiniu'
import {logger} from '../utils'
import config, {Qiniu} from '../config'

module.exports.upload = ({
  putPath,
  getPath,
  hasCache
}): Promise<void> => {
  return new Promise(resolve => {
    config().then(({
      accessKey,
      secretKey,
      bucket
   }: Qiniu) => {
      let mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
      let options = {
        scope: bucket,
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
          if ((respInfo && respInfo.statusCode) === 200) {
            logger.success({
              getPath,
              putPath,
              hasCache
            })
            resolve()
            return
          } else {
            logger.fail({
              getPath,
              putPath,
              hasCache
            })
            process.exit(1)
          }
        }
      )
    })
  })
}
