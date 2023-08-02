import Decode from './pipeline/decode';
import Execute from './pipeline/execute';
import InstructionFetch from './pipeline/instruction-fetch';
import MemoryAccess from './pipeline/memory-access';
import WriteBack from './pipeline/write-back';
import Register32 from './register32';
import SystemInterface from './system-interface';
import RAMDevice from './system-interface/ram';
import ROMDevice from './system-interface/rom';

enum State {
  InstructionFetch = 0,
  Decode = 1,
  Execute = 2,
  MemoryAccess = 3,
  WriteBack = 4,
}

class RVI32System {
  state = State.InstructionFetch;

  rom = new ROMDevice();
  ram = new RAMDevice();
  regFile = Array.from({ length: 32 }, () => new Register32());

  bus = new SystemInterface(this.rom, this.ram);

  IF = new InstructionFetch({
    bus: this.bus,
    shouldStall: () => this.state !== State.InstructionFetch,
  });

  DE = new Decode({
    regFile: this.regFile,
    getInstructionIn: () => this.IF.getInstructionOut(),
    shouldStall: () => this.state !== State.Decode,
  });

  EX = new Execute({
    getDecodedIn: () => this.DE.getDecodedOut(),
    shouldStall: () => this.state !== State.Execute,
  });

  MEM = new MemoryAccess({
    getExecValuesIn: () => this.EX.getExecValuesOut(),
    shouldStall: () => this.state !== State.MemoryAccess,
  });

  WB = new WriteBack({
    regFile: this.regFile,
    getMAValuesIn: () => this.MEM.getMAValuesOut(),
    shouldStall: () => this.state !== State.WriteBack,
  });

  compute() {
    this.IF.compute();
    this.DE.compute();
    this.EX.compute();
    this.MEM.compute();
    this.WB.compute();
  }

  latchNext() {
    this.IF.latchNext();
    this.DE.latchNext();
    this.EX.latchNext();
    this.MEM.latchNext();
    this.WB.latchNext();
    this.regFile.forEach((reg) => reg.latchNext());
  }

  cycle() {
    this.compute();
    this.latchNext();

    switch (this.state) {
      case State.InstructionFetch:
        this.state = State.Decode;
        break;
      case State.Decode:
        this.state = State.Execute;
        break;
      case State.Execute:
        this.state = State.MemoryAccess;
        break;
      case State.MemoryAccess:
        this.state = State.WriteBack;
        break;
      case State.WriteBack:
        this.state = State.InstructionFetch;
        break;
    }
  }
}

const rv = new RVI32System();

rv.regFile[1].value = 0x80000000;
rv.regFile[2].value = 0x00000001;

rv.rom.load(
  new Uint32Array([
    0b0100000_00010_00001_101_00011_0110011, // SRL r2, r1, r3
  ]),
);

while (true) {
  rv.cycle();
  console.log(rv.regFile[3].value);
}
