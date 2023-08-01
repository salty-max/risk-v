import { MMIODevice } from '.'

export const ROMSize = 0x400 * 0x400 // 1MB

export default class ROMDevice implements MMIODevice {
  private rom = new Uint32Array(ROMSize / 4)

  read(address: number): number {
    return this.rom[address & (ROMSize / 4 - 1)]
  }

  load(data: Uint32Array): void {
    for (let i = 0; i < ROMSize / 4; i++) {
      if (i >= data.length) {
        this.rom[i] = 0xffffffff
      } else {
        this.rom[i] = data[i]
      }
    }
  }
}
