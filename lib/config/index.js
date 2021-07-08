"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const config = () => {
    return Object.assign({}, require(path_1.default.resolve(process.cwd(), './deploy.config')));
};
exports.default = config();
