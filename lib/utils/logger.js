"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fail = exports.success = void 0;
const kleur_1 = __importDefault(require("kleur"));
const success = ({ from, to, hasCache }) => {
    const status = kleur_1.default.green('[成功]'.padEnd(16));
    hasCache = hasCache
        ? kleur_1.default.yellow('[不支持]'.padEnd(15))
        : '[支持]'.padEnd(16);
    const arrow = kleur_1.default.yellow(' -> ');
    console.log(`${status}${hasCache}${from}${arrow}${to}`);
};
exports.success = success;
const fail = ({ from, to, hasCache }) => {
    const status = kleur_1.default.red('[失败]'.padEnd(16));
    hasCache = hasCache
        ? kleur_1.default.yellow('[不支持]'.padEnd(15))
        : '[支持]'.padEnd(16);
    const arrow = kleur_1.default.yellow(' -> ');
    console.log(`${status}${hasCache}${from}${arrow}${to}`);
};
exports.fail = fail;
