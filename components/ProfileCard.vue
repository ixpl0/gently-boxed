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

/* The poster headline: huge heavy caps in ink on the bright accent surface,
   wrapping into a stacked two-line block like the reference lockup.
   Archivo Black ships a single 400 weight — anything heavier would be synthesized */
.name {
  margin: 0;
  color: var(--side-ink);
  font-family: var(--font-poster);
  font-size: 54px;
  font-weight: 400;
  line-height: 0.95;
  letter-spacing: -0.01em;
  text-align: center;
  text-transform: uppercase;
}

/* Roles are bare text: pill backgrounds are gone, so a wide column gap alone
   separates them, and the wrap row gap stays modest for narrow screens.
   White heavy caps — the reference's small name labels on the accent field */
.specializations {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px 24px;
  margin-top: 26px;
  color: #fff;
  font-family: var(--font-poster);
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

/* The condensed tracked-out tagline line, like the reference subtitle */
.description {
  margin: 22px 0 0;
  color: var(--side-ink);
  font-family: var(--font-condensed);
  font-size: 15px;
  font-weight: 500;
  line-height: 1.8;
  letter-spacing: 0.18em;
  text-align: center;
  text-transform: uppercase;
}

.profile-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 40px;
  transform-style: preserve-3d;
}

/* Actions follow the face's inverted palette: ink condensed caps that answer
   hover with white instead of the shared pastel-accent tint */
.profile-actions :deep(.ui-button) {
  color: var(--side-ink);
  font-family: var(--font-condensed);
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.profile-actions :deep(.ui-button:hover) {
  color: #fff;
}
</style>
