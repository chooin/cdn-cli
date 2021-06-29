import Oss from 'ali-oss';
import {logger} from '../utils'
import config, {Aliyun} from '../config'

export const upload = ({
  putPath,
  getPath,
  hasCache
}): Promise<void> => {
  return new Promise((resolve) => {
    config().then(({
      region,
      bucket,
      accessKeyId,
      accessKeySecret,
    }: Aliyun) => {
      const client = new Oss({
        region,
        bucket,
        accessKeyId,
        accessKeySecret,
      })
      const options = hasCache
        ? {
          headers: {
            'Cache-Control': 'no-cache, private'
          }
        }
        : {}
      client.put(
        putPath,
        getPath,
        options
      ).then(({status}) => {
        if (status === 200) {
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
