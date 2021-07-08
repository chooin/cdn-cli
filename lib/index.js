"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deploy = void 0;
const glob_1 = __importDefault(require("glob"));
const kleur_1 = __importDefault(require("kleur"));
const path_1 = require("path");
const config_1 = __importDefault(require("./config"));
const utils_1 = require("./utils");
const walk = (from, options = {}) => {
    return new Promise((resolve, reject) => {
        glob_1.default(from, options, (err, matches) => {
            if (err !== null) {
                console.log(err);
                process.exit(1);
            }
            resolve(matches);
        });
    });
};
const deploy = (environment) => __awaiter(void 0, void 0, void 0, function* () {
    config_1.default.environment = config_1.default.environments[environment];
    if (!config_1.default.environment) {
        console.log(kleur_1.default.red('错误，请检查 deploy.config.js 中 environment 是否存在'));
        process.exit(1);
    }
    config_1.default.rules = config_1.default
        .rules
        .filter(item => item.from)
        .map(item => {
        return Object.assign({
            to: '.',
            ignore: [],
            noCache: [],
            lastUpload: [],
        }, item);
    })
        .map((item) => {
        if (item.from.indexOf('*') === -1) {
            if (utils_1.file.isDirectory(item.from)) {
                item.to = path_1.join(item.from, item.to);
                item.from = `${item.from}/**/*`;
            }
        }
        return item;
    });
    console.log(config_1.default);
    Promise
        .all(config_1.default.rules.map(rule => {
        return walk(rule.from);
    }))
        .then((items) => {
    });
});
exports.deploy = deploy;
