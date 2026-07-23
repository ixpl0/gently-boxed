<template>
  <div class="front-content">
    <UiText>
      <h1 class="name">
        Kashcheev Andrei
      </h1>
    </UiText>

    <UiText>
      <div class="specializations">
        <span>AI Harness Architect</span>
        <span>Frontend Developer</span>
        <span>Team Leader</span>
      </div>
    </UiText>

    <div class="description">
      <div>{{ experienceYears }} years of experience</div>
      <div>{{ age }} years old &middot; Tbilisi, Georgia</div>
    </div>

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
/* No card panel here: the face itself is the surface, and generous empty
   margins around the centered column carry the clean, spacious look */
.front-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 420px;
  transform-style: preserve-3d;
}

.name {
  margin: 0;

  /* Headings take a pastel tint of the side accent, like the reference's colored titles */
  color: oklch(from var(--side-accent) 82% calc(c * 0.6) h);
  font-size: 30px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: 0.01em;
  text-align: center;
}

/* Roles are bare text: pill backgrounds are gone, so a wide column gap alone
   separates them, and the wrap row gap stays modest for narrow screens */
.specializations {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px 28px;
  margin-top: 22px;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
}

.description {
  margin: 26px 0 0;
  color: #b4bdcf;
  font-size: 15px;
  line-height: 1.7;
  text-align: center;
}

.profile-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 44px;
  transform-style: preserve-3d;
}
</style>
