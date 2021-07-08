import qiniu from 'qiniu'
import {logger} from '../index'
import config, {Qiniu} from '../../config'

export default ({
  putPath,
  getPath,
  hasCache,
}): Promise<void> => {
  return new Promise(resolve => {
    const {
      accessKey,
      secretKey,
      bucket
    } = config.environment as Qiniu
    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
    const putPolicy = new qiniu.rs.PutPolicy({
      scope: bucket,
      expires: 7200
    })
    if (!process.env.QINIU_UPLOAD_TOKEN) {
      process.env.QINIU_UPLOAD_TOKEN = putPolicy.uploadToken(mac)
    }
    const qiniuConfig = new qiniu.conf.Config()
    const formUploader = new qiniu.form_up.FormUploader(qiniuConfig)
    const putExtra = new qiniu.form_up.PutExtra()
    formUploader.putFile(
      process.env.QINIU_UPLOAD_TOKEN,
      putPath.substring(1),
      getPath,
      putExtra,
      (err, respBody, respInfo) => {
        if (respInfo?.statusCode === 200) {
          logger.success({
            getPath,
            putPath,
            hasCache
          })
          resolve()
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
}
