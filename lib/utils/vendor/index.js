"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aliyun_1 = __importDefault(require("./aliyun"));
const qiniu_1 = __importDefault(require("./qiniu"));
const tencent_1 = __importDefault(require("./tencent"));
exports.default = (vendor, options) => {
    switch (vendor) {
        case 'aliyun': {
            aliyun_1.default(options);
            break;
        }
        case 'qiniu': {
            qiniu_1.default(options);
            break;
        }
        case 'tencent': {
            tencent_1.default(options);
            break;
        }
    }
};
