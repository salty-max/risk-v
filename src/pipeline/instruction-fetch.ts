import Register32 from '../register32';
import SystemInterface, { MemoryMap } from '../system-interface';
import PipelineStage from './pipeline-stage';

export interface InstructionFetchParams {
  bus: SystemInterface;
  shouldStall(): boolean;
}

export default class InstructionFetch extends PipelineStage {
  private _pc = new Register32(MemoryMap.ProgramROMStart);
  private _instruction = new Register32(0);

  private _bus: InstructionFetchParams['bus'];
  private _shouldStall: InstructionFetchParams['shouldStall'];

  constructor(params: InstructionFetchParams) {
    super();
    this._bus = params.bus;
    this._shouldStall = params.shouldStall;
  }

  getInstructionOut() {
    return this._instruction.value;
  }

  readyToSend(): boolean {
    return true;
  }

  readyToReceive(): boolean {
    return true;
  }

  compute(): void {
    if (!this._shouldStall()) {
      this._instruction.value = this._bus.read(this._pc.value);
      this._pc.value += 4;
    }
  }

  latchNext(): void {
    this._instruction.latchNext()
    this._pc.latchNext();
  }
}
