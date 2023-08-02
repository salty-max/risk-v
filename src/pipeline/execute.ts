import Register32 from '../register32';
import { twos, untwos } from '../util';
import Decode from './decode';
import PipelineStage from './pipeline-stage';

enum ALUOperation {
  ADD = 0b000,
  SLL = 0b001,
  SLT = 0b010,
  SLTU = 0b011,
  XOR = 0b100,
  SR = 0b101,
  OR = 0b110,
  AND = 0b111,
}

export interface ExecuteParams {
  getDecodedIn(): ReturnType<Decode['getDecodedOut']>;
  shouldStall(): boolean;
}

export default class Execute extends PipelineStage {
  private _getDecodedIn: ExecuteParams['getDecodedIn'];
  private _shouldStall: ExecuteParams['shouldStall'];

  private _aluResult = new Register32(0);

  private _rd = 0;
  private _rdNext = 0;

  private _isALUOp = false;
  private _isALUOpNext = false;

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
    if (!this._shouldStall()) {
      const decoded = this._getDecodedIn();

      this._rdNext = decoded.rd;

      const isRegisterOp = Boolean((decoded.opcode >> 5) & 1);
      const isAlternateOp = Boolean((decoded.imm11_0 >> 10) & 1);

      // Zero extend the immediate
      const imm32 = twos((decoded.imm11_0 << 20) >> 20);

      this._isALUOpNext = (decoded.opcode & 0b1011111) === 0b0010011;

      switch (decoded.funct3) {
        case ALUOperation.ADD: {
          if (isRegisterOp) {
            this._aluResult.value = isAlternateOp
              ? decoded.rs1 - decoded.rs2
              : decoded.rs1 + decoded.rs2;
          } else {
            this._aluResult.value = decoded.rs1 + imm32;
          }

          break;
        }

        case ALUOperation.SLL: {
          this._aluResult.value = isRegisterOp
            ?decoded.rs1 << decoded.rs2
            :decoded.rs1 << decoded.shamt;

          break;
        }

        case ALUOperation.SLT: {
          this._aluResult.value = isRegisterOp
            ? Number(untwos(decoded.rs1) < untwos(decoded.rs2))
            : Number(untwos(decoded.rs1) < untwos(imm32));

          break;
        }

        case ALUOperation.SLTU: {
          this._aluResult.value = isRegisterOp
            ? Number(decoded.rs1 < decoded.rs2)
            : Number(decoded.rs1 < imm32);

          break;
        }

        case ALUOperation.XOR: {
          this._aluResult.value = isRegisterOp
            ?decoded.rs1 ^ decoded.rs2
            :decoded.rs1 ^ imm32;

          break;
        }

        case ALUOperation.SR: {
          if (isRegisterOp) {
            this._aluResult.value = isAlternateOp
              ?decoded.rs1 >> decoded.rs2
              : decoded.rs1 >>> decoded.rs2;
          } else {
            decoded.rs1 >>> decoded.shamt;
          }

          break;
        }

        case ALUOperation.OR: {
          this._aluResult.value = isRegisterOp
            ?decoded.rs1 | decoded.rs2
            :decoded.rs1 | imm32;

          break;
        }

        case ALUOperation.AND: {
          this._aluResult.value = isRegisterOp
            ?decoded.rs1 & decoded.rs2
            :decoded.rs1 & imm32;

          break;
        }
      }
    }
  }

  latchNext(): void {
    this._aluResult.latchNext()
    this._rd = this._rdNext;
    this._isALUOp = this._isALUOpNext;
  }

  getExecValuesOut() {
    return {
      aluResult: this._aluResult.value,
      rd: this._rd,
      isALUOp: this._isALUOp,
    };
  }
}
