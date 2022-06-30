import { defineConfig } from 'vite-plugin-windicss';

function num(from: number = 1, to: number = 100): number[] {
  return Array.from({
    length: to - from + 1,
  }).map((_, i) => i + from);
}

export default defineConfig({
  safelist: [
    ...num(1, 100).map((n) => `grid-rows-${n}`),
    ...num(1, 100).map((n) => `grid-cols-${n}`),
  ],
});
