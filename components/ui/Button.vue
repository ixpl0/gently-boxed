<template>
  <button
    class="ui-button"
    @click="(event) => $emit('click', event)"
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
  box-shadow: 0 2px 6px rgb(0 0 0 / 15%);
  backdrop-filter: blur(2px);
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    background: rgb(255 255 255 / 25%);
    border-color: rgb(255 255 255 / 50%);
    box-shadow: 0 4px 12px rgb(0 0 0 / 25%);
    transform: translateY(-1px);
  }
}
</style>
