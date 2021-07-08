"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deploy = void 0;
const kleur_1 = __importDefault(require("kleur"));
const config_1 = __importDefault(require("./config"));
const walk = () => {
};
const deploy = (environment) => {
    config_1.default.environment = config_1.default.environments[environment];
    if (!config_1.default.environment) {
        console.log(kleur_1.default.red('错误，请检查 deploy.config.js 中 environment 是否存在'));
        process.exit(1);
    }
    console.log(config_1.default);
};
exports.deploy = deploy;
