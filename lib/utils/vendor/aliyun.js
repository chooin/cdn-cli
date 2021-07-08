"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ali_oss_1 = __importDefault(require("ali-oss"));
const index_1 = require("../index");
const config_1 = __importDefault(require("../../config"));
exports.default = ({ putPath, getPath, hasCache }) => {
    return new Promise((resolve) => {
        config_1.default().then(({ region, bucket, accessKeyId, accessKeySecret, }) => {
            const oss = new ali_oss_1.default({
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
