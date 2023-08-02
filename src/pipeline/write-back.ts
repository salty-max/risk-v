import Register32 from '../register32';
import MemoryAccess from './memory-access';
import PipelineStage from './pipeline-stage';

export interface WriteBackParams {
  regFile: Array<Register32>;
  getMAValuesIn(): ReturnType<MemoryAccess['getMAValuesOut']>;
  shouldStall(): boolean;
}

export default class WriteBack extends PipelineStage {
  private _regFile: WriteBackParams['regFile'];
  private _getMAValuesIn: WriteBackParams['getMAValuesIn'];
  private _shouldStall: WriteBackParams['shouldStall'];

  constructor(params: WriteBackParams) {
    super();
    this._regFile = params.regFile;
    this._getMAValuesIn = params.getMAValuesIn;
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
      const { aluResult, rd, isALUOp } = this._getMAValuesIn();
      if (isALUOp) {
        this._regFile[rd].value = aluResult;
      }
    }
  }

  latchNext(): void {}
}
