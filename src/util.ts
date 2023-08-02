export const toHexString = (n: number, l = 8) =>
  `0x${n.toString(16).padStart(l, '0')}`;

export const toBinaryString = (n: number, l = 32) =>
  `0b${n.toString(2).padStart(l, '0')}`;

const twosTemp = new Uint32Array(1);

export const twos = (v: number) => {
  twosTemp[0] = v
  return twosTemp[0];
};

export const untwos = (v: number) => {
  if (v >= 0x80000000) {
    return ~~v;
  } else {
    return v;
  }
};
