<template>
  <div class="main-page">
    <TheCube />
  </div>
</template>

<script setup lang="ts">
import TheCube from '#shared/ui/TheCube.vue';
</script>

<style scoped>
.main-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f7f7fa;
}
</style>
