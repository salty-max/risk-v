import Register32 from '../register32';
import PipelineStage from './pipeline-stage';

export interface DecodeParams {
  regFile: Array<Register32>;
  getInstructionIn(): number;
  shouldStall(): boolean;
}

export default class Decode extends PipelineStage {
  private _instruction = new Register32(0);
  private _opcode = new Register32(0);
  private _rd = new Register32(0);
  private _funct3 = new Register32(0);
  private _rs1 = new Register32(0); 
  private _rs2 = new Register32(0);
  private _imm11_0 = new Register32(0);
  private _funct7 = new Register32(0);
  private _shamt = new Register32(0);

  private _regFile: DecodeParams['regFile'];

  private _getInstructionIn: DecodeParams['getInstructionIn'];
  private _shouldStall: DecodeParams['shouldStall'];

  constructor(params: DecodeParams) {
    super();
    this._regFile = params.regFile;
    this._getInstructionIn = params.getInstructionIn;
    this._shouldStall = params.shouldStall;
  }

  getInstructionOut() {
    return this._instruction;
  }

  readyToSend(): boolean {
    return true;
  }

  readyToReceive(): boolean {
    return true;
  }

  compute(): void {
    if (!this._shouldStall()) {
      this._instruction.value = this._getInstructionIn();
      this._opcode.value = this._instruction.nextValue & 0x7f;
      this._rd.value = (this._instruction.nextValue >> 7) & 0x1f;
      this._funct3.value = (this._instruction.nextValue >> 12) & 0x07;
      this._imm11_0.value = (this._instruction.nextValue >>> 20) & 0xfff;
      this._funct7.value = (this._instruction.nextValue >>> 25) & 0x7f;

      const rs1Address = (this._instruction.nextValue >> 15) & 0x1f;
      const rs2Address = (this._instruction.nextValue >> 20) & 0x1f;

      this._shamt.value = rs2Address;
      this._rs1.value = rs1Address === 0 ? 0 : this._regFile[rs1Address].value;
      this._rs2.value = rs2Address === 0 ? 0 : this._regFile[rs2Address].value;
    }
  }

  latchNext(): void {
    this._instruction.latchNext()
    this._opcode.latchNext()
    this._rd.latchNext()
    this._funct3.latchNext()
    this._rs1.latchNext()
    this._rs2.latchNext()
    this._imm11_0.latchNext()
    this._funct7.latchNext()
    this._shamt.latchNext()
  }

  getDecodedOut() {
    return {
      instruction: this._instruction.value,
      opcode: this._opcode.value,
      rd: this._rd.value,
      funct3: this._funct3.value,
      rs1: this._rs1.value,
      rs2: this._rs2.value,
      imm11_0: this._imm11_0.value,
      funct7: this._funct7.value,
      shamt: this._shamt.value,
    };
  }
}
