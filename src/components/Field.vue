<script lang="ts">
export interface FieldProps {
  row: number;
  col: number;
  value: number;
  state: 'open' | 'closed' | 'flagged';
}
</script>

<script setup lang="ts">
import { Icon } from '@iconify/vue';

const props = defineProps<{
  row: number;
  col: number;
  value: number;
  state: 'open' | 'closed' | 'flagged';
}>();

const emit = defineEmits<{
  (e: 'leftClick', props: FieldProps): void;
  (e: 'middleClick', props: FieldProps): void;
  (e: 'rightClick', props: FieldProps): void;
}>();
</script>

<template lang="pug">
.select-none.w-8.h-8.border.border-gray-500.flex.justify-center.items-center.font-bold(
  :class="{ 'bg-gray-200': state !== 'open', 'hover:bg-gray-100': state === 'closed' }",
  @click.left.prevent="emit('leftClick', props)",
  @click.middle.prevent="emit('middleClick', props)",
  @click.right.prevent="emit('rightClick', props)"
)
  template(v-if="state === 'flagged'")
    Icon(icon="logos:vue")
  template(v-if="state === 'open'")
    span(v-if="value === 0")
    span.text-blue-700(v-if="value === 1") 1
    span.text-green-700(v-if="value === 2") 2
    span.text-red-600(v-if="value === 3") 3
    span.text-blue-900(v-if="value === 4") 4
    span.text-red-900(v-if="value === 5") 5
    span.text-cyan-600(v-if="value === 6") 6
    span.text-gray-700(v-if="value === 7") 7
    span.text-gray-500(v-if="value === 8") 8
    Icon(v-if="value === 9", icon="mdi:mine")
</template>
