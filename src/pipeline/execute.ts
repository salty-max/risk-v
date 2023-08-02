import Register32 from '../register32';
import { twos } from '../util';
import { DecodedValues } from './instruction-decode';
import PipelineStage from './pipeline-stage';

enum ALUOperation {
  ADD = 0b000,
  SLL = 0b001,
  SLT = 0b010,
  SLTU = 0b011,
  XOR = 0b100,
  SRL = 0b101,
  SRA = 0b101,
  OR = 0b110,
  AND = 0b111,
}

export interface ExecuteParams {
  getDecodedIn(): DecodedValues;
  shouldStall(): boolean;
}

export default class Execute extends PipelineStage {
  private _getDecodedIn: ExecuteParams['getDecodedIn'];
  private _shouldStall: ExecuteParams['shouldStall'];

  private _aluResult = new Register32(0);
  private _aluResultNext = new Register32(0);

  constructor(params: ExecuteParams) {
    super();
    this._getDecodedIn = params.getDecodedIn;
    this._shouldStall = params.shouldStall;
  }

  readyToSend(): boolean {
    return true;
  }

  readyToReceive(): boolean {
    return true;
  }

  compute(): void {
    if (!this._shouldStall) {
      const decoded = this._getDecodedIn();
      const isRegisterOp = Boolean((decoded.opcode >> 5) & 1);
      const isAlternateOp = Boolean((decoded.imm11_0 >> 10) & 1);

      // Zero extend the immediate
      const imm32 = twos((decoded.imm11_0 << 20) >> 20);

      switch (decoded.funct3) {
        case ALUOperation.ADD: {
          if (isRegisterOp) {
            this._aluResultNext.value = isAlternateOp
              ? decoded.rs1 - decoded.rs2
              : decoded.rs1 + decoded.rs2;
          } else {
            this._aluResultNext.value = decoded.rs1 + imm32;
          }

          break;
        }
      }
    }
  }

  latchNext(): void {
    this._aluResult.value = this._aluResultNext.value;
  }

  getALUResultOut(): number {
    return this._aluResult.value;
  }
}
