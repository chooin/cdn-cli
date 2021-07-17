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
const cos_nodejs_sdk_v5_1 = __importDefault(require("cos-nodejs-sdk-v5"));
const fs_extra_1 = require("fs-extra");
const logger = __importStar(require("../logger"));
const config_1 = require("../../config");
exports.default = ({ from, to, noCache }) => {
    return new Promise(resolve => {
        const { bucket, region, secretId, secretKey, } = config_1.config.environment;
        const client = new cos_nodejs_sdk_v5_1.default({
            SecretId: secretId,
            SecretKey: secretKey
        });
        const body = fs_extra_1.createReadStream(from);
        const contentLength = fs_extra_1.statSync(from).size;
        const cacheControl = noCache
            ? 'no-cache, private'
            : undefined;
        client
            .putObject({
            Bucket: bucket,
            Region: region,
            Key: to,
            Body: body,
            ContentLength: contentLength,
            CacheControl: cacheControl,
        }, (err, data) => {
            if (err || (data === null || data === void 0 ? void 0 : data.statusCode) !== 200) {
                logger.uploadFail({
                    from,
                    to,
                    noCache
                });
                console.log(err);
                process.exit(1);
            }
            logger.uploadSuccess({
                from,
                to,
                noCache
            });
            resolve();
        });
    });
};
