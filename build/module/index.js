"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const system_interface_1 = require("./system-interface");
const ram_1 = require("./system-interface/ram");
const rom_1 = require("./system-interface/rom");
const util_1 = require("./util");
class RVI32System {
    rom = new rom_1.default();
    ram = new ram_1.default();
    bus = new system_interface_1.default(this.rom, this.ram);
}
const rv = new RVI32System();
rv.rom.load(new Uint32Array([0xdeadbeef, 0xc0decafe]));
rv.ram.write(0x20000000, 0xdefec8);
console.log((0, util_1.toHexString)(rv.bus.read(0x10000000)));
console.log((0, util_1.toHexString)(rv.bus.read(0x10000004)));
console.log((0, util_1.toHexString)(rv.bus.read(0x20000000)));
