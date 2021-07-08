import Oss from 'ali-oss';
import {logger} from '../index'
import config, {Aliyun} from '../../config'

export default ({
  putPath,
  getPath,
  hasCache
}): Promise<void> => {
  return new Promise((resolve) => {
    const {
      region,
      bucket,
      accessKeyId,
      accessKeySecret,
    } = config.environment as Aliyun
    const oss = new Oss({
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
    oss
      .put(putPath, getPath, options)
      .then(({res}) => {
        if (res?.status === 200) {
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
