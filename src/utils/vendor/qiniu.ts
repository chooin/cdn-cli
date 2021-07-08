import qiniu from 'qiniu'
import * as logger from '../logger'
import config, {Qiniu} from '../../config'

export default ({
  from,
  to,
  hasCache,
}): Promise<void> => {
  return new Promise(resolve => {
    const {
      accessKey,
      secretKey,
      bucket
    } = config.environment as Qiniu
    if (!process.env.QINIU_UPLOAD_TOKEN) {
      const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
      const putPolicy = new qiniu.rs.PutPolicy({
        scope: bucket,
        expires: 7200
      })
      process.env.QINIU_UPLOAD_TOKEN = putPolicy.uploadToken(mac)
    }
    const qiniuConfig = new qiniu.conf.Config()
    const formUploader = new qiniu.form_up.FormUploader(qiniuConfig)
    const putExtra = new qiniu.form_up.PutExtra()
    formUploader.putFile(
      process.env.QINIU_UPLOAD_TOKEN,
      to.substring(1),
      from,
      putExtra,
      (err, respBody, respInfo) => {
        if (err || respInfo?.statusCode !== 200) {
          logger.fail({
            from,
            to,
            hasCache
          })
          console.log(err)
          process.exit(1)
        }
        logger.success({
          from,
          to,
          hasCache
        })
        resolve()
      }
    )
  })
}
