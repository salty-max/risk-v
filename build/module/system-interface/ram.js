"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RAMSize = void 0;
exports.RAMSize = 0x400 * 0x400 * 4; // 4MB
class RAMDevice {
    ram = new Uint32Array(exports.RAMSize / 4);
    read(address) {
        return this.ram[address & (exports.RAMSize / 4 - 1)];
    }
    write(address, value) {
        this.ram[address & (exports.RAMSize / 4 - 1)] = value;
    }
}
exports.default = RAMDevice;
