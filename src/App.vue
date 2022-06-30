<script setup lang="ts">
import type { FieldProps } from '@/components/Field.vue';
import Field from '@/components/Field.vue';
import { ref, watch } from 'vue';

const rows = ref(9);
const cols = ref(9);
const mines = ref(10);

function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

const fields = ref([] as FieldProps[][]);

watch(
  [rows, cols, mines],
  () => {
    generateField();
    fillFieldWithMines();
    calculateFieldValues();
  },
  { immediate: true },
);

function generateField(): void {
  if (rows.value < 3) {
    rows.value = 3;
  }
  if (rows.value > 100) {
    rows.value = 100;
  }
  if (cols.value < 3) {
    cols.value = 3;
  }
  if (cols.value > 100) {
    cols.value = 100;
  }

  fields.value = [];
  for (let row = 1; row <= rows.value; row++) {
    fields.value.push([]);
    for (let col = 1; col <= cols.value; col++) {
      fields.value[row - 1]!.push({
        row,
        col,
        value: 0,
        state: 'closed',
      });
    }
  }
}

function fillFieldWithMines(): void {
  if (mines.value < 1) {
    mines.value = 1;
  }
  if (mines.value > rows.value * cols.value - 1) {
    mines.value = rows.value * cols.value - 1;
  }

  for (let m = 0; m < mines.value; m++) {
    const row = getRandomInt(0, rows.value);
    const col = getRandomInt(0, cols.value);
    const field = fields.value[row]![col]!;
    if (field.value === 9) {
      m--;
      continue;
    }
    fields.value[row]![col]!.value = 9;
  }
}

function calculateFieldValues(): void {
  for (let r = 0; r < rows.value; r++) {
    for (let c = 0; c < cols.value; c++) {
      const field = fields.value[r]![c]!;
      if (field.value === 9) {
        continue;
      }
      let value = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const row = r + i;
          const col = c + j;
          if (row < 0 || row >= rows.value || col < 0 || col >= cols.value) {
            continue;
          }
          if (fields.value[row]![col]!.value === 9) {
            value++;
          }
        }
      }
      field.value = value;
    }
  }
}

function getField(i: number, j: number): FieldProps {
  return fields.value[i]![j]!;
}

function clickField(props: FieldProps): void {
  console.log('Clicked cell', props);
}
</script>

<template lang="pug">
span Height:
input(v-model.number="cols", type="number")
span Width:
input(v-model.number="rows", type="number")
span Mines:
input(v-model.number="mines", type="number")

.flex
  .grid(:class="[`grid-rows-${cols}`, `grid-cols-${rows}`]")
    template(v-for="(row, i) in rows", :key="i")
      template(v-for="(col, j) in cols", :key="j")
        Field(v-bind="getField(i, j)", @click-cell="clickField")
</template>
