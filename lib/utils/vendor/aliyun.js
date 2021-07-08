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
const ali_oss_1 = __importDefault(require("ali-oss"));
const logger = __importStar(require("../logger"));
const config_1 = __importDefault(require("../../config"));
exports.default = ({ from, to, hasCache }) => {
    return new Promise((resolve) => {
        const { region, bucket, accessKeyId, accessKeySecret, } = config_1.default.environment;
        const client = new ali_oss_1.default({
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
        client
            .put(to, from, options)
            .then((result) => {
            var _a;
            if (((_a = result === null || result === void 0 ? void 0 : result.res) === null || _a === void 0 ? void 0 : _a.status) !== 200) {
                logger.fail({
                    from,
                    to,
                    hasCache
                });
                console.log(result);
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
