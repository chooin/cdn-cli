"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.error = exports.warning = exports.success = exports.info = exports.log = exports.uploadFail = exports.uploadSuccess = void 0;
const kleur_1 = require("kleur");
const uploadSuccess = ({ from, to, noCache }) => {
    const status = kleur_1.green('[成功]'.padEnd(16));
    noCache = noCache
        ? kleur_1.yellow('[不支持]'.padEnd(15))
        : '[支持]'.padEnd(16);
    const arrow = kleur_1.yellow(' -> ');
    console.log(`${status}${noCache}${from}${arrow}${to}`);
};
exports.uploadSuccess = uploadSuccess;
const uploadFail = ({ from, to, noCache }) => {
    const status = kleur_1.red('[失败]'.padEnd(16));
    noCache = noCache
        ? kleur_1.yellow('[不支持]'.padEnd(15))
        : '[支持]'.padEnd(16);
    const arrow = kleur_1.yellow(' -> ');
    console.log(`${status}${noCache}${from}${arrow}${to}`);
};
exports.uploadFail = uploadFail;
const kleur = (messages, color, options) => {
    if (Array.isArray(messages)) {
        if (options && options.inline) {
            console.log(color(messages.join(' ')));
        }
        else {
            messages.forEach((message) => {
                console.log(color(message));
            });
        }
    }
    else {
        console.log(color(messages));
    }
};
const log = (messages, options) => {
    kleur(messages, kleur_1.white, options);
};
exports.log = log;
const info = (messages, options) => {
    kleur(messages, kleur_1.white, options);
};
exports.info = info;
const success = (messages, options) => {
    kleur(messages, kleur_1.green, options);
};
exports.success = success;
const warning = (messages, options) => {
    kleur(messages, kleur_1.yellow, options);
};
exports.warning = warning;
const error = (messages, options) => {
    kleur(messages, kleur_1.red, options);
};
exports.error = error;
