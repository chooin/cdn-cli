import qiniu from 'qiniu';
import { logger } from '../utils';
import config from '../config';
module.exports.upload = ({ putPath, getPath, hasCache, }) => {
    return new Promise(resolve => {
        config().then(({ accessKey, secretKey, bucket }) => {
            const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
            const putPolicy = new qiniu.rs.PutPolicy({
                scope: bucket,
                expires: 7200
            });
            if (!process.env.QINIU_UPLOAD_TOKEN) {
                process.env.QINIU_UPLOAD_TOKEN = putPolicy.uploadToken(mac);
            }
            const config = new qiniu.conf.Config();
            const formUploader = new qiniu.form_up.FormUploader(config);
            const putExtra = new qiniu.form_up.PutExtra();
            formUploader.putFile(process.env.QINIU_UPLOAD_TOKEN, putPath.substring(1), getPath, putExtra, (err, respBody, respInfo) => {
                if ((respInfo === null || respInfo === void 0 ? void 0 : respInfo.statusCode) === 200) {
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
