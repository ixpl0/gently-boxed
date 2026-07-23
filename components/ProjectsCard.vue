<template>
  <div class="projects-card">
    <UiTitle>Projects</UiTitle>

    <div class="projects">
      <a
        v-for="project in PROJECTS"
        :key="project.name"
        class="project-row"
        :href="project.href"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span class="project-name">{{ project.name }}</span>
        <span class="project-description">{{ project.description }}</span>
        <span class="project-tags">{{ project.tags.join(' · ') }}</span>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ProjectEntry {
  name: string;
  description: string;
  href: string;
  tags: string[];
}

// TODO: replace the placeholder projects with real ones
const PROJECTS: ProjectEntry[] = [
  {
    name: 'Gently Boxed',
    description: 'This site — the CSS 3D cube you are spinning right now',
    href: 'https://github.com/ixpl0/gently-boxed',
    tags: ['Nuxt 3', 'CSS 3D', 'TypeScript'],
  },
  {
    name: 'Project Two',
    description: 'One line about what it does and why it was worth building',
    href: 'https://github.com/ixpl0',
    tags: ['TypeScript', 'Vue 3'],
  },
  {
    name: 'Project Three',
    description: 'One line about what it does and why it was worth building',
    href: 'https://github.com/ixpl0',
    tags: ['AI agents', 'Node.js'],
  },
];
</script>

<style scoped>
.projects-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 400px;
  transform-style: preserve-3d;
}

.projects {
  display: flex;
  flex-direction: column;
  align-self: stretch;
  gap: 20px;
  margin-top: 28px;
  transform-style: preserve-3d;
}

/* A bare text link: no panel, no border — hover lifts the row and tints the name */
.project-row {
  display: flex;
  flex-direction: column;
  gap: 3px;
  color: #fff;
  text-decoration: none;
  transform: translateZ(var(--elevation-step));
  transition: all 0.2s;

  &:hover {
    transform: translateZ(calc(var(--elevation-step) + 10px));
  }
}

.project-name {
  font-size: 15px;
  font-weight: 600;
  line-height: 1.3;
  transition: color 0.2s;
}

.project-row:hover .project-name {
  color: oklch(from var(--side-accent) 82% calc(c * 0.6) h);
}

.project-description {
  color: #b4bdcf;
  font-size: 13px;
  line-height: 1.4;
}

.project-tags {
  color: #9aa5bb;
  font-size: 12px;
}
</style>
