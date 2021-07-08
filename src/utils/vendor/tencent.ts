import Cos from 'cos-nodejs-sdk-v5'
import {createReadStream, statSync} from 'fs-extra'
import * as logger from '../logger'
import config, {Tencent} from '../../config'

export default ({
  from,
  to,
  hasCache
}): Promise<void> => {
  return new Promise(resolve => {
    const {
      bucket,
      region,
      secretId,
      secretKey,
    } = config.environment as Tencent
    const client = new Cos({
      SecretId: secretId,
      SecretKey: secretKey
    })
    const body = createReadStream(from)
    const contentLength = statSync(from).size
    const cacheControl = hasCache
      ? 'no-cache, private'
      : undefined
    client
      .putObject(
      {
        Bucket: bucket,
        Region: region,
        Key: to,
        Body: body,
        ContentLength: contentLength,
        CacheControl: cacheControl,
        },
      (err, data) => {
        if (err || data?.statusCode !== 200) {
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
      })
  })
}
