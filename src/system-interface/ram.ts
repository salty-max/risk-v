import { MMIODevice } from ".";

export const RAMSize = 0x400 * 0x400 * 4; // 4MB

export default class RAMDevice implements MMIODevice {
  private ram = new Uint32Array(RAMSize / 4);

  read(address: number): number {
    return this.ram[address & (RAMSize / 4 - 1)];
  }

  write(address: number, value: number): void {
    this.ram[address & (RAMSize / 4 - 1)] = value;
  }
}
