<template>
  <div class="front-content">
    <UiCard class="profile-card">
      <UiText>
        <h1 class="name">
          Kashcheev Andrei
        </h1>
      </UiText>

      <div class="specializations">
        <UiBadge>AI Harness Architect</UiBadge>
        <UiBadge>Frontend Developer</UiBadge>
        <UiBadge>Team Leader</UiBadge>
      </div>

      <UiText>
        <div class="description">
          {{ age }} years old &middot; Tbilisi, Georgia
        </div>
      </UiText>
    </UiCard>

    <div class="profile-actions">
      <UiButton>
        Contacts
      </UiButton>

      <ShareButton />
    </div>
  </div>
</template>

<script setup lang="ts">
const BIRTH_DATE = new Date(1985, 7, 11);

const getFullYearsSince = (birthDate: Date): number => {
  const now = new Date();
  const yearsDifference = now.getFullYear() - birthDate.getFullYear();
  const hadBirthdayThisYear = now.getMonth() > birthDate.getMonth()
    || (now.getMonth() === birthDate.getMonth() && now.getDate() >= birthDate.getDate());

  return hadBirthdayThisYear ? yearsDifference : yearsDifference - 1;
};

const age = getFullYearsSince(BIRTH_DATE);
</script>

<style scoped>
.front-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  transform-style: preserve-3d;
}

.profile-card {
  width: 320px;
}

.name {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  line-height: 1.2;
  text-align: center;
}

.specializations {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-top: 12px;
  transform-style: preserve-3d;
}

.description {
  margin: 16px 0 0;
  color: #fff;
  font-size: 15px;
  line-height: 1.5;
  text-align: center;
}

.profile-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 24px;
  transform-style: preserve-3d;
}
</style>
