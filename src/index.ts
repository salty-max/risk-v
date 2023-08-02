import Execute from './pipeline/execute';
import Decode from './pipeline/instruction-decode';
import InstructionFetch from './pipeline/instruction-fetch';
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
    getInstructionIn: this.IF.getInstructionOut.bind(this.IF),
    shouldStall: () => this.state !== State.Decode,
  });

  EX = new Execute({
    getDecodedIn: this.DE.getDecodedOut.bind(this.DE),
    shouldStall: () => this.state !== State.Execute,
  });

  compute() {
    this.IF.compute();
    this.DE.compute();
    this.EX.compute();
  }

  latchNext() {
    this.IF.latchNext();
    this.DE.latchNext();
    this.EX.latchNext();
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
        this.state = State.InstructionFetch;
        break;
    }
  }
}

const rv = new RVI32System();

rv.regFile[1].value = 0x01020304;
rv.regFile[2].value = 0x02030405;

rv.rom.load(
  new Uint32Array([
    0b000000000001_00001_000_00011_0010011, // ADDI 1, r1, r3
    0b0000000_00001_00010_000_00100_0010011, // ADD r1, r2, r4
    0b0100000_00001_00010_000_00100_0010011, // SUB r1, r2, r4
  ]),
);

while (true) {
  rv.cycle();
}
