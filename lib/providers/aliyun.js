import Oss from 'ali-oss';
import { logger } from '../utils';
import config from '../config';
export const upload = ({ putPath, getPath, hasCache }) => {
    return new Promise((resolve) => {
        config().then(({ region, bucket, accessKeyId, accessKeySecret, }) => {
            const oss = new Oss({
                region,
                bucket,
                accessKeyId,
                accessKeySecret,
            });
            const options = hasCache
                ? {
                    headers: {
                        'Cache-Control': 'no-cache, private'
                    }
                }
                : {};
            oss
                .put(putPath, getPath, options)
                .then(({ res }) => {
                if ((res === null || res === void 0 ? void 0 : res.status) === 200) {
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
