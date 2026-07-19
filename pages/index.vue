<template>
  <div class="main-page">
    <TheCube>
      <template #front>
        <ProfileCard />
      </template>
    </TheCube>
  </div>
</template>

<style scoped>
.main-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;

  /* TODO: временно почти чёрный фон для отладки визуальных артефактов, вернуть #f7f7fa */
  background: #0a0a0a;
}
</style>
