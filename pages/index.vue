<template>
  <div class="main-page">
    <TheCube>
      <template #front>
        <ProfileCard />
      </template>
    </TheCube>
  </div>
</template>

<script setup lang="ts">
import { TheCube } from '#widgets/the-cube';
import { ProfileCard } from '#widgets/profile-card';
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
