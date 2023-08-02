import Execute from './execute';
import PipelineStage from './pipeline-stage';

export interface MemoryAccessParams {
  getExecValuesIn(): ReturnType<Execute['getExecValuesOut']>;
  shouldStall(): boolean;
}

export default class MemoryAccess extends PipelineStage {
  private _getExecValuesIn: MemoryAccessParams['getExecValuesIn'];
  private _shouldStall: MemoryAccessParams['shouldStall'];

  private _aluResult = 0;
  private _aluResultNext = 0;

  private _rd = 0;
  private _rdNext = 0;

  private _isALUOp = false;
  private _isALUOpNext = false;

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
      this._aluResultNext = aluResult;
      this._rdNext = rd;
      this._isALUOpNext = isALUOp;
    }
  }

  latchNext(): void {
    this._aluResult = this._aluResultNext;
    this._rd = this._rdNext;
    this._isALUOp = this._isALUOpNext;
  }

  getMAValuesOut() {
    return {
      aluResult: this._aluResult,
      rd: this._rd,
      isALUOp: this._isALUOp,
    };
  }
}
