import Oss from 'ali-oss';
import * as logger from '../logger'
import config, {Aliyun} from '../../config'

export default ({
  from,
  to,
  hasCache
}): Promise<void> => {
  return new Promise((resolve) => {
    const {
      region,
      bucket,
      accessKeyId,
      accessKeySecret,
    } = config.environment as Aliyun
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
    client
      .put(to, from, options)
      .then((result) => {
        if (result?.res?.status !== 200) {
          logger.fail({
            from,
            to,
            hasCache
          })
          console.log(result)
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
