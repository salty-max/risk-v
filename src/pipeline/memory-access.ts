import Register32 from '../register32';
import Execute from './execute';
import PipelineStage from './pipeline-stage';

export interface MemoryAccessParams {
  getExecValuesIn(): ReturnType<Execute['getExecValuesOut']>;
  shouldStall(): boolean;
}

export default class MemoryAccess extends PipelineStage {
  private _getExecValuesIn: MemoryAccessParams['getExecValuesIn'];
  private _shouldStall: MemoryAccessParams['shouldStall'];

  private _aluResult = new Register32(0);
  private _rd = new Register32(0);
  private _isALUOp = new Register32(0);

  constructor(params: MemoryAccessParams) {
    super();
    this._getExecValuesIn = params.getExecValuesIn;
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
      const { aluResult, rd, isALUOp } = this._getExecValuesIn();
      this._aluResult.value = aluResult;
      this._rd.value = rd;
      this._isALUOp.value = isALUOp;
    }
  }

  latchNext(): void {
    this._aluResult.latchNext()
    this._rd.latchNext()
    this._isALUOp.latchNext()
  }

  getMAValuesOut() {
    return {
      aluResult: this._aluResult.value,
      rd: this._rd.value,
      isALUOp: this._isALUOp.value,
    };
  }
}
