import { swap } from "./Utility";

export function getBubbleSortAnimations(arr) {
  const animations = [];
  const n = arr.length;
  const copy = [...arr];
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      animations.push([[j, j + 1], false]);
      if (copy[j] > copy[j + 1]) {
        animations.push([[j, copy[j + 1], j + 1, copy[j]], true]);
        swap(copy, j, j + 1);
      }
    }
  }
  return animations;
}
