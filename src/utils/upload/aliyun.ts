import Oss from 'ali-oss';
import * as logger from '../logger';
import { config } from '../../config';

export default ({ from, to, noCache }): Promise<void> => {
  return new Promise((resolve) => {
    const { region, bucket, accessKeyId, accessKeySecret } =
      config.environment as Environment.Aliyun;
    const client = new Oss({
      region,
      bucket,
      accessKeyId,
      accessKeySecret,
    });
    const options = noCache
      ? {
          headers: {
            'Cache-Control': 'no-cache, private',
          },
        }
      : {};
    client.put(to, from, options).then((result) => {
      if (result?.res?.status !== 200) {
        logger.uploadFail({
          from,
          to,
          noCache,
        });
        console.log(result);
        process.exit(1);
      }
      logger.uploadSuccess({
        from,
        to,
        noCache,
      });
      resolve();
    });
  });
};
