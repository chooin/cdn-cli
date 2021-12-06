import Cos from 'cos-nodejs-sdk-v5';
import { createReadStream, statSync } from 'fs-extra';
import * as logger from '../logger';
import { config } from '../../config';

export default ({ from, to, noCache }): Promise<void> => {
  return new Promise((resolve) => {
    const { bucket, region, secretId, secretKey } =
      config.environment as Environment.Tencent;
    const client = new Cos({
      SecretId: secretId,
      SecretKey: secretKey,
    });
    const body = createReadStream(from);
    const contentLength = statSync(from).size;
    const cacheControl = noCache ? 'no-cache, private' : undefined;
    client.putObject(
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
          logger.uploadFail({
            from,
            to,
            noCache,
          });
          logger.error(err?.message);
          process.exit(1);
        }
        logger.uploadSuccess({
          from,
          to,
          noCache,
        });
        resolve();
      },
    );
  });
};
