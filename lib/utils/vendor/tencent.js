"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cos_nodejs_sdk_v5_1 = __importDefault(require("cos-nodejs-sdk-v5"));
const fs_extra_1 = require("fs-extra");
const index_1 = require("../index");
const config_1 = __importDefault(require("../../config"));
exports.default = ({ putPath, getPath, hasCache }) => {
    return new Promise(resolve => {
        const { bucket, region, secretId, secretKey, } = config_1.default.environment;
        const client = new cos_nodejs_sdk_v5_1.default({
            SecretId: secretId,
            SecretKey: secretKey
        });
        const body = fs_extra_1.createReadStream(getPath);
        const contentLength = fs_extra_1.statSync(getPath).size;
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
};
