<template>
  <button
    class="ui-button"
    @click.stop="(event) => $emit('click', event)"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
defineEmits<{
  click: [event: MouseEvent];
}>();
</script>

<style scoped>
.ui-button {
  padding: 10px 20px;
  color: #fff;
  font-size: 16px;
  background: rgb(255 255 255 / 15%);
  border: 1px solid rgb(255 255 255 / 30%);
  border-radius: 4px;
  backdrop-filter: blur(4px);
  transform: translateZ(var(--elevation-step));
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    background: rgb(255 255 255 / 25%);
    border-color: rgb(255 255 255 / 50%);
    transform: translateZ(calc(var(--elevation-step) + 10px));
  }
}
</style>
