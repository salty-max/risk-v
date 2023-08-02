import PipelineStage from './pipeline-stage';

export interface InstructionDecodeParams {
  getInstructionIn(): number;
  shouldStall(): boolean;
}

export default class InstructionDecode extends PipelineStage {
  private _instruction = 0;
  private _instructionNext = 0;

  private _opcode = 0;
  private _opcodeNext = 0;

  private _rd = 0;
  private _rdNext = 0;

  private _funct3 = 0;
  private _funct3Next = 0;

  private _rs1 = 0;
  private _rs1Next = 0;

  private _rs2 = 0;
  private _rs2Next = 0;

  private _imm11_0 = 0;
  private _imm11_0Next = 0;

  private _funct7 = 0;
  private _funct7Next = 0;

  private _shamt = 0;
  private _shamtNext = 0;

  private _getInstructionIn: InstructionDecodeParams['getInstructionIn'];
  private _shouldStall: InstructionDecodeParams['shouldStall'];

  constructor(params: InstructionDecodeParams) {
    super();
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
    if (!this._shouldStall) {
      this._instructionNext = this._getInstructionIn();
      this._opcodeNext = this._instructionNext & 0x7f;
      this._rdNext = (this._instructionNext >> 7) & 0x1f;
      this._funct3Next = (this._instructionNext >> 12) & 0x7;
      this._rs1Next = (this._instructionNext >> 15) & 0x1f;
      this._rs2Next = (this._instructionNext >> 20) & 0x1f;
      this._imm11_0Next = (this._instructionNext >>> 20) & 0x1f;
      this._funct7Next = (this._instructionNext >>> 25) & 0x7f;
      this._shamtNext = this._rs2Next
    }
  }

  latchNext(): void {
    this._instruction = this._instructionNext;
    this._opcode = this._opcodeNext;
    this._rd = this._rdNext;
    this._funct3 = this._funct3Next;
    this._rs1 = this._rs1Next;
    this._rs2 = this._rs2Next;
    this._imm11_0 = this._imm11_0Next;
    this._funct7 = this._funct7Next;
    this._shamt = this._shamtNext;
  }

  getDecoding() {
    return {
      instruction: this._instruction,
      opcode: this._opcode,
      rd: this._rd,
      funct3: this._funct3,
      rs1: this._rs1,
      rs2: this._rs2,
      imm11_0: this._imm11_0,
      funct7: this._funct7,
      shamt: this._shamt,
    }
  }
}
