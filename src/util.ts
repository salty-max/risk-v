export const toHexString = (n: number, l = 8) =>
  `0x${n.toString(16).padStart(l, '0')}`;

export const toBinaryString = (n: number, l = 32) =>
  `0b${n.toString(2).padStart(l, '0')}`;

export const twos = (v: number) => {
  if (v < 0) {
    return (~-v + 1) & 0xffffffff;
  } else {
    return v;
  }
};
