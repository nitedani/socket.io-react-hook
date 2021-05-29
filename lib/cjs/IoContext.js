"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var IoContext = react_1.default.createContext({
    createConnection: function () { return undefined; },
    getConnection: function () { return undefined; },
    getLastMessage: function () { return undefined; },
    setLastMessage: function () { return undefined; },
    registerSharedListener: function () { return undefined; },
    getError: function () { return undefined; },
    setError: function () { return undefined; },
    getStatus: function () { return "disconnected"; },
});
exports.default = IoContext;
