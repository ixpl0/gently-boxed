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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f7f7fa;
}
</style>
