<template>
  <div class="experience-card">
    <UiTitle>Experience</UiTitle>

    <div class="timeline">
      <div
        v-for="entry in EXPERIENCE_ENTRIES"
        :key="entry.period"
      >
        <div class="entry-period">
          {{ entry.period }}
        </div>

        <div class="entry-role">
          {{ entry.role }} &middot; {{ entry.company }}
        </div>

        <div class="entry-summary">
          {{ entry.summary }}
        </div>
      </div>
    </div>
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
.experience-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 400px;
  transform-style: preserve-3d;
}

.timeline {
  display: flex;
  flex-direction: column;
  align-self: stretch;
  gap: 22px;
  margin-top: 28px;
}

/* Bare text entries: the accent-tinted period line alone structures the timeline */
.entry-period {
  color: oklch(from var(--side-accent) 75% calc(c * 0.5) h);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.06em;
}

.entry-role {
  margin-top: 4px;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.3;
}

.entry-summary {
  margin-top: 3px;
  color: #b4bdcf;
  font-size: 13px;
  line-height: 1.45;
}
</style>
