"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROMSize = void 0;
exports.ROMSize = 0x400 * 0x400; // 1MB
class ROMDevice {
    rom = new Uint32Array(exports.ROMSize / 4);
    read(address) {
        return this.rom[address & (exports.ROMSize / 4 - 1)];
    }
    load(data) {
        for (let i = 0; i < exports.ROMSize / 4; i++) {
            if (i >= data.length) {
                this.rom[i] = 0xffffffff;
            }
            else {
                this.rom[i] = data[i];
            }
        }
    }
}
exports.default = ROMDevice;
