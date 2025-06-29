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
  background: #f7f7fa;
}
</style>
