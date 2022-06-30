<script setup lang="ts">
import type { FieldProps } from '@/components/Field.vue';
import Field from '@/components/Field.vue';
import { computed, ref, watch } from 'vue';

const rows = ref(9);
const cols = ref(9);
const mines = ref(10);

const countFlags = computed(() => {
  let count = 0;
  for (let rowIndex = 0; rowIndex < rows.value; rowIndex++) {
    for (let colIndex = 0; colIndex < cols.value; colIndex++) {
      const field = getField(rowIndex, colIndex);
      if (field.state === 'flagged') {
        count++;
      }
    }
  }
  return count;
});

const firstClick = ref(false);

function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

const fields = ref([] as FieldProps[][]);

watch([rows, cols, mines], restart, { immediate: true });

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
  for (let rowIndex = 0; rowIndex < rows.value; rowIndex++) {
    fields.value.push([]);
    for (let colIndex = 0; colIndex < cols.value; colIndex++) {
      fields.value[rowIndex]!.push({
        row: rowIndex,
        col: colIndex,
        value: 0,
        state: 'closed',
      });
    }
  }
}

function fillFieldWithMines(initialPosition: {
  row: number;
  col: number;
}): void {
  if (mines.value < 1) {
    mines.value = 1;
  }
  if (mines.value > rows.value * cols.value - 1) {
    mines.value = rows.value * cols.value - 1;
  }

  for (let m = 0; m < mines.value; m++) {
    const rowIndex = getRandomInt(0, rows.value);
    const colIndex = getRandomInt(0, cols.value);
    const field = getField(rowIndex, colIndex);
    if (
      field.value === 9 ||
      (initialPosition.row === rowIndex && initialPosition.col === colIndex)
    ) {
      m--;
      continue;
    }
    field.value = 9;
  }
}

function calculateFieldValues(): void {
  for (let rowIndex = 0; rowIndex < rows.value; rowIndex++) {
    for (let colIndex = 0; colIndex < cols.value; colIndex++) {
      const field = getField(rowIndex, colIndex);
      if (field.value === 9) {
        continue;
      }
      let value = 0;
      for (let deltaRowIndex = -1; deltaRowIndex <= 1; deltaRowIndex++) {
        for (let deltaColIndex = -1; deltaColIndex <= 1; deltaColIndex++) {
          const row = rowIndex + deltaRowIndex;
          const col = colIndex + deltaColIndex;
          if (row < 0 || row >= rows.value || col < 0 || col >= cols.value) {
            continue;
          }
          if (getField(row, col).value === 9) {
            value++;
          }
        }
      }
      field.value = value;
    }
  }
}

function restart(): void {
  generateField();
  firstClick.value = false;
}

function getField(rowIndex: number, colIndex: number): FieldProps {
  return fields.value[rowIndex]![colIndex]!;
}

function leftClickField(props: FieldProps): void {
  console.debug('Left clicked cell', props);

  const field = getField(props.row, props.col);

  if (firstClick.value === false) {
    firstClick.value = true;
    fillFieldWithMines(props);
    calculateFieldValues();
  }

  if (field.state === 'closed') {
    field.state = 'open';

    if (field.value === 0) {
      for (let deltaRowIndex = -1; deltaRowIndex <= 1; deltaRowIndex++) {
        for (let deltaColIndex = -1; deltaColIndex <= 1; deltaColIndex++) {
          const row = field.row + deltaRowIndex;
          const col = field.col + deltaColIndex;
          if (row < 0 || row >= rows.value || col < 0 || col >= cols.value) {
            continue;
          }
          leftClickField(getField(row, col));
        }
      }
    }

    if (field.value === 9) {
      for (let rowIndex = 0; rowIndex < rows.value; rowIndex++) {
        for (let colIndex = 0; colIndex < cols.value; colIndex++) {
          const field2 = getField(rowIndex, colIndex);
          if (field2.state === 'closed') {
            field2.state = 'open';
          }
        }
      }
    }
  } else if (field.state === 'open' && field.value > 0 && field.value < 9) {
    // Count flags around
    let count = 0;
    for (let deltaRowIndex = -1; deltaRowIndex <= 1; deltaRowIndex++) {
      for (let deltaColIndex = -1; deltaColIndex <= 1; deltaColIndex++) {
        const row = field.row + deltaRowIndex;
        const col = field.col + deltaColIndex;
        if (row < 0 || row >= rows.value || col < 0 || col >= cols.value) {
          continue;
        }
        const field2 = getField(row, col);
        if (field2.state === 'flagged') {
          count++;
        }
      }
    }

    if (count === field.value) {
      for (let deltaRowIndex = -1; deltaRowIndex <= 1; deltaRowIndex++) {
        for (let deltaColIndex = -1; deltaColIndex <= 1; deltaColIndex++) {
          const row = field.row + deltaRowIndex;
          const col = field.col + deltaColIndex;
          if (row < 0 || row >= rows.value || col < 0 || col >= cols.value) {
            continue;
          }
          const field2 = getField(row, col);
          if (field2.state === 'closed') {
            leftClickField(field2);
          }
        }
      }
    }
  }
}

function middleClickField(props: FieldProps): void {
  console.debug('Middle clicked cell', props);

  const field = getField(props.row, props.col);
}

function rightClickField(props: FieldProps): void {
  console.debug('Right clicked cell', props);

  const field = getField(props.row, props.col);

  if (field.state === 'closed') {
    field.state = 'flagged';
  } else if (field.state === 'flagged') {
    field.state = 'closed';
  }
}
</script>

<template lang="pug">
h4.ml-2.text-xl Minesvueper

span.ml-2 Repository:
a.ml-1.mt-2.text-blue-600.underline(
  href="https://github.com/Shinigami92/minesvueper"
) https://github.com/Shinigami92/minesvueper

br

a.ml-2.mt-2.text-blue-600.underline(
  href="https://github.com/Shinigami92/minesvueper/issues/new"
) Found a bug? Open an issue!

br

span.ml-2 Width:
input.border-2.w-14(v-model.number="cols", type="number")

span.ml-2 Height:
input.border-2.w-14(v-model.number="rows", type="number")

span.ml-2 Mines:
input.border-2.w-14(v-model.number="mines", type="number")

span.ml-2 Flags: {{ countFlags }}

button.ml-2.border-3.px-1(@click="restart") Restart

.m-2.flex
  .grid(:class="[`grid-rows-${rows}`, `grid-cols-${cols}`]")
    template(v-for="(row, rowIndex) in rows", :key="`row-${rowIndex}`")
      template(
        v-for="(col, colIndex) in cols",
        :key="`row-${rowIndex}-col-${colIndex}`"
      )
        Field(
          v-bind="getField(rowIndex, colIndex)",
          @left-click="leftClickField",
          @middle-click="middleClickField",
          @right-click="rightClickField"
        )
</template>
