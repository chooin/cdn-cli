import Cos from 'cos-nodejs-sdk-v5'
import {createReadStream, statSync} from 'fs-extra';
import {logger} from '../index'
import config, {Tencent} from '../../config'

export default ({
  putPath,
  getPath,
  hasCache
}): Promise<void> => {
  return new Promise(resolve => {
    const {
      bucket,
      region,
      secretId,
      secretKey,
    } = config.environment as Tencent;
    const client = new Cos({
      SecretId: secretId,
      SecretKey: secretKey
    })
    const body = createReadStream(getPath)
    const contentLength = statSync(getPath).size
    const cacheControl = hasCache
      ? 'no-cache, private'
      : undefined
    client
      .putObject(
      {
        Bucket: bucket,
        Region: region,
        Key: putPath,
        Body: body,
        ContentLength: contentLength,
        CacheControl: cacheControl,
        },
      (err, data) => {
        if (data?.statusCode === 200) {
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
      })
  })
}
