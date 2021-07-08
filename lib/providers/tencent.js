import Cos from 'cos-nodejs-sdk-v5';
import { createReadStream, statSync } from 'fs-extra';
import { logger } from '../utils';
import config from '../config';
export const upload = ({ putPath, getPath, hasCache }) => {
    return new Promise(resolve => {
        config().then(({ bucket, region, secretId, secretKey, }) => {
            const client = new Cos({
                SecretId: secretId,
                SecretKey: secretKey
            });
            const body = createReadStream(getPath);
            const contentLength = statSync(getPath).size;
            const cacheControl = hasCache
                ? 'no-cache, private'
                : undefined;
            client
                .putObject({
                Bucket: bucket,
                Region: region,
                Key: putPath,
                Body: body,
                ContentLength: contentLength,
                CacheControl: cacheControl,
            }, (err, data) => {
                if ((data === null || data === void 0 ? void 0 : data.statusCode) === 200) {
                    logger.success({
                        getPath,
                        putPath,
                        hasCache
                    });
                    resolve();
                }
                else {
                    logger.fail({
                        getPath,
                        putPath,
                        hasCache
                    });
                    process.exit(1);
                }
            });
        });
    });
};
