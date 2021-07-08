"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const qiniu_1 = __importDefault(require("qiniu"));
const logger = __importStar(require("../logger"));
const config_1 = __importDefault(require("../../config"));
exports.default = ({ from, to, hasCache, }) => {
    return new Promise(resolve => {
        const { accessKey, secretKey, bucket } = config_1.default.environment;
        if (!process.env.QINIU_UPLOAD_TOKEN) {
            const mac = new qiniu_1.default.auth.digest.Mac(accessKey, secretKey);
            const putPolicy = new qiniu_1.default.rs.PutPolicy({
                scope: bucket,
                expires: 7200
            });
            process.env.QINIU_UPLOAD_TOKEN = putPolicy.uploadToken(mac);
        }
        const qiniuConfig = new qiniu_1.default.conf.Config();
        const formUploader = new qiniu_1.default.form_up.FormUploader(qiniuConfig);
        const putExtra = new qiniu_1.default.form_up.PutExtra();
        formUploader.putFile(process.env.QINIU_UPLOAD_TOKEN, to.substring(1), from, putExtra, (err, respBody, respInfo) => {
            if (err || (respInfo === null || respInfo === void 0 ? void 0 : respInfo.statusCode) !== 200) {
                logger.fail({
                    from,
                    to,
                    hasCache
                });
                console.log(err);
                process.exit(1);
            }
            logger.success({
                from,
                to,
                hasCache
            });
            resolve();
        });
    });
};
