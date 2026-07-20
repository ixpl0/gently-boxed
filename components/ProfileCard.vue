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

      <div class="description">
        <div>{{ experienceYears }} years of experience</div>
        <div>{{ age }} years old &middot; Tbilisi, Georgia</div>
      </div>
    </UiCard>

    <div class="profile-actions">
      <UiButton @click="emit('openContacts')">
        Contacts
      </UiButton>

      <ShareButton />
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  openContacts: [];
}>();

const BIRTH_DATE = new Date(1985, 7, 11);
const CAREER_START_DATE = new Date(2010, 10, 1);

const getFullYearsSince = (startDate: Date): number => {
  const now = new Date();
  const yearsDifference = now.getFullYear() - startDate.getFullYear();
  const hadAnniversaryThisYear = now.getMonth() > startDate.getMonth()
    || (now.getMonth() === startDate.getMonth() && now.getDate() >= startDate.getDate());

  return hadAnniversaryThisYear ? yearsDifference : yearsDifference - 1;
};

const age = getFullYearsSince(BIRTH_DATE);
const experienceYears = getFullYearsSince(CAREER_START_DATE);
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
