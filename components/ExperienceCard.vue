<template>
  <div class="experience-content">
    <UiCard class="experience-card">
      <UiText>
        <h2 class="title">
          Experience
        </h2>
      </UiText>

      <div class="timeline">
        <div
          v-for="entry in EXPERIENCE_ENTRIES"
          :key="entry.period"
          class="entry"
        >
          <UiBadge>{{ entry.period }}</UiBadge>

          <div>
            <div class="entry-role">
              {{ entry.role }} &middot; {{ entry.company }}
            </div>

            <div class="entry-summary">
              {{ entry.summary }}
            </div>
          </div>
        </div>
      </div>
    </UiCard>
  </div>
</template>

<script setup lang="ts">
interface ExperienceEntry {
  period: string;
  role: string;
  company: string;
  summary: string;
}

// TODO: replace the placeholder entries with the real career history
const EXPERIENCE_ENTRIES: ExperienceEntry[] = [
  {
    period: '2021 — now',
    role: 'Team Lead',
    company: 'Company One',
    summary: 'Leading a frontend team and building agent harnesses for everyday development work',
  },
  {
    period: '2016 — 2021',
    role: 'Senior Frontend Developer',
    company: 'Company Two',
    summary: 'Design system, performance work and mentoring across product teams',
  },
  {
    period: '2010 — 2016',
    role: 'Frontend Developer',
    company: 'Company Three',
    summary: 'From jQuery widgets to full SPA frameworks in production',
  },
];
</script>

<style scoped>
.experience-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  transform-style: preserve-3d;
}

.experience-card {
  width: 400px;
}

.title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.2;
  text-align: center;
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 18px;
  transform-style: preserve-3d;
}

.entry {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  transform-style: preserve-3d;
}

.entry-role {
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.3;
}

.entry-summary {
  margin-top: 2px;
  color: #fff;
  font-size: 13px;
  line-height: 1.45;
}
</style>
