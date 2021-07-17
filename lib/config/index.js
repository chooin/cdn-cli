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
exports.setConfig = exports.config = void 0;
const path_1 = require("path");
const kleur_1 = __importDefault(require("kleur"));
const utils_1 = require("../utils");
const glob_1 = __importDefault(require("glob"));
const defaultConfig = () => {
    return Object.assign({}, require(path_1.resolve(process.cwd(), './deploy.config')));
};
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
exports.config = defaultConfig();
const setConfig = (environment) => __awaiter(void 0, void 0, void 0, function* () {
    exports.config.environment = exports.config.environments[environment];
    if (exports.config.environment) {
        delete exports.config.environments;
    }
    else {
        console.log(kleur_1.default.red('错误，请检查 deploy.config.js 中 environment 是否存在'));
        process.exit(1);
    }
    exports.config.rules = exports.config
        .rules
        .filter(item => item.from)
        .map(item => {
        return Object.assign({
            to: '.',
            ignore: [],
            noCache: [],
            lastUpload: [],
            files: [],
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
    yield Promise.all(exports.config.rules.map((rule) => {
        return walk(rule.from, {
            ignore: rule.ignore
        });
    })).then(files => {
        exports.config.rules = exports.config.rules.map((rule, index) => {
            return Object.assign(Object.assign({}, rule), { files: files[index] });
        });
    });
});
exports.setConfig = setConfig;
