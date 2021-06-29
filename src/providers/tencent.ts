import Cos from 'cos-nodejs-sdk-v5'
import {createReadStream, statSync} from 'fs-extra';
import {logger} from '../utils'
import config, {Tencent} from '../config'

export const upload = ({
  putPath,
  getPath,
  hasCache
}): Promise<void> => {
  return new Promise(resolve => {
    config().then(({
      bucket,
      region,
      secretId,
      secretKey,
    }: Tencent) => {
      const client = new Cos({
        SecretId: secretId,
        SecretKey: secretKey
      })
      client.putObject({
        Bucket: bucket,
        Region: region,
        Key: putPath,
        Body: createReadStream(getPath),
        ContentLength: statSync(getPath).size,
        CacheControl: hasCache
          ? 'no-cache, private'
          : undefined
      }, (err, {statusCode}) => {
        if (statusCode === 200) {
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
      })
    })
  })
}
