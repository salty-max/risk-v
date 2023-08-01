"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryMap = void 0;
const util_1 = require("../util");
var MemoryMap;
(function (MemoryMap) {
    MemoryMap[MemoryMap["ProgramROMStart"] = 268435456] = "ProgramROMStart";
    MemoryMap[MemoryMap["ProgramROMEnd"] = 536870911] = "ProgramROMEnd";
    MemoryMap[MemoryMap["RAMStart"] = 536870912] = "RAMStart";
    MemoryMap[MemoryMap["RAMEnd"] = 805306367] = "RAMEnd";
})(MemoryMap || (exports.MemoryMap = MemoryMap = {}));
class SystemInterface {
    rom;
    ram;
    constructor(rom, ram) {
        this.rom = rom;
        this.ram = ram;
    }
    read(address) {
        if ((address & 0b11) !== 0) {
            throw new Error(`unaligned memory access: ${(0, util_1.toHexString)(address)}`);
        }
        if ((address & MemoryMap.ProgramROMStart) === MemoryMap.ProgramROMStart) {
            return this.rom.read((address & 0x0fffffff) >> 2);
        }
        if ((address & MemoryMap.RAMStart) === MemoryMap.RAMStart) {
            return this.ram.read((address & 0x0fffffff) >> 2);
        }
        return 0;
    }
    write(address, value) {
        if ((address & 0b11) !== 0) {
            throw new Error(`unaligned memory write: ${(0, util_1.toHexString)(address)} (value = ${(0, util_1.toHexString)(value)})})`);
        }
        if ((address & MemoryMap.RAMStart) === MemoryMap.RAMStart) {
            return this.ram.write((address & 0x0fffffff) >> 2, value);
        }
    }
}
exports.default = SystemInterface;
