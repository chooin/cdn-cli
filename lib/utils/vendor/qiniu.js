"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const qiniu_1 = __importDefault(require("qiniu"));
const index_1 = require("../index");
const config_1 = __importDefault(require("../../config"));
exports.default = ({ putPath, getPath, hasCache, }) => {
    return new Promise(resolve => {
        config_1.default().then(({ accessKey, secretKey, bucket }) => {
            const mac = new qiniu_1.default.auth.digest.Mac(accessKey, secretKey);
            const putPolicy = new qiniu_1.default.rs.PutPolicy({
                scope: bucket,
                expires: 7200
            });
            if (!process.env.QINIU_UPLOAD_TOKEN) {
                process.env.QINIU_UPLOAD_TOKEN = putPolicy.uploadToken(mac);
            }
            const config = new qiniu_1.default.conf.Config();
            const formUploader = new qiniu_1.default.form_up.FormUploader(config);
            const putExtra = new qiniu_1.default.form_up.PutExtra();
            formUploader.putFile(process.env.QINIU_UPLOAD_TOKEN, putPath.substring(1), getPath, putExtra, (err, respBody, respInfo) => {
                if ((respInfo === null || respInfo === void 0 ? void 0 : respInfo.statusCode) === 200) {
                    index_1.logger.success({
                        getPath,
                        putPath,
                        hasCache
                    });
                    resolve();
                }
                else {
                    index_1.logger.fail({
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
