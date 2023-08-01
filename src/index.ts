import SystemInterface from './system-interface'
import RAMDevice from './system-interface/ram'
import ROMDevice from './system-interface/rom'
import { toHexString } from './util'

class RVI32System {
  rom = new ROMDevice()
  ram = new RAMDevice()

  bus = new SystemInterface(this.rom, this.ram)
}

const rv = new RVI32System()
rv.rom.load(new Uint32Array([0xdeadbeef, 0xc0decafe]))
rv.ram.write(0x20000000, 0xdefec8)

console.log(toHexString(rv.bus.read(0x10000000)))
console.log(toHexString(rv.bus.read(0x10000004)))
console.log(toHexString(rv.bus.read(0x20000000)))
