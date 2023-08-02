export default class Register32 {
  private _value = new Uint32Array(2);

  constructor(value = 0) {
    this._value[0] = this._value[1] = value;
  }

  get value(): number {
    return this._value[0];
  }

  set value(v: number) {
    this._value[1] = v
  }

  latchNext(): void {
    this._value[0] = this._value[1];
  }

  getWorkingValue(): number {
    return this._value[1];
  }
}
