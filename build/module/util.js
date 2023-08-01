"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBinaryString = exports.toHexString = void 0;
const toHexString = (n, l = 8) => `0x${n.toString(16).padStart(l, '0')}`;
exports.toHexString = toHexString;
const toBinaryString = (n, l = 32) => `0b${n.toString(2).padStart(l, '0')}`;
exports.toBinaryString = toBinaryString;
