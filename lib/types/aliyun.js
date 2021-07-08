import Oss from 'ali-oss';
import { logger } from '../utils';
import config from '../config';
export const upload = ({ putPath, getPath, hasCache }) => {
    return new Promise((resolve) => {
        config().then(({ region, bucket, accessKeyId, accessKeySecret, }) => {
            const client = new Oss({
                region,
                bucket,
                accessKeyId,
                accessKeySecret,
            });
            client.put(putPath, getPath, hasCache
                ? {
                    headers: {
                        'Cache-Control': 'no-cache, private'
                    }
                }
                : {}).then(({ status }) => {
                if (status === 200) {
                    logger.success({
                        getPath,
                        putPath,
                        hasCache
                    });
                    resolve();
                    return;
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
