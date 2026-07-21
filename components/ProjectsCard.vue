<template>
  <div class="projects-content">
    <UiCard class="projects-card">
      <UiText>
        <h2 class="title">
          Projects
        </h2>
      </UiText>

      <div class="projects">
        <a
          v-for="project in PROJECTS"
          :key="project.name"
          class="project-row"
          :href="project.href"
          target="_blank"
          rel="noopener noreferrer"
          @click.stop
        >
          <span class="project-name">{{ project.name }}</span>
          <span class="project-description">{{ project.description }}</span>
          <span class="project-tags">{{ project.tags.join(' · ') }}</span>
        </a>
      </div>
    </UiCard>
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
.projects-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  transform-style: preserve-3d;
}

.projects-card {
  width: 400px;
}

.title {
  margin: 0;

  /* Headings take a pastel tint of the side accent, like the reference's colored titles */
  color: oklch(from var(--side-accent) 82% calc(c * 0.6) h);
  font-size: 22px;
  font-weight: 700;
  line-height: 1.2;
  text-align: center;
}

.projects {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 18px;
  transform-style: preserve-3d;
}

/* An elevated panel like UiButton, but a block-level link with its own cast shadow */
.project-row {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 12px 16px;
  color: #fff;
  text-decoration: none;
  background: oklch(from var(--surface-color) calc(l + 0.07) c h);
  border: 1px solid oklch(from var(--surface-color) calc(l + 0.16) c h);
  border-radius: 12px;
  corner-shape: squircle;
  transform: translateZ(var(--elevation-step));
  transform-style: preserve-3d;
  transition: all 0.2s;

  &::before {
    position: absolute;
    inset: 0;
    background: oklch(from var(--surface-color) calc(l - 0.04) c h);
    border-radius: inherit;
    corner-shape: inherit;
    transform: translateZ(calc(2px - var(--elevation-step)));
    transition: all 0.2s;
    content: "";
  }

  &:hover {
    background: oklch(from var(--surface-color) calc(l + 0.11) c h);
    border-color: oklch(from var(--surface-color) calc(l + 0.22) c h);
    transform: translateZ(calc(var(--elevation-step) + 10px));

    /* The projection stays on the surface while the row lifts */
    &::before {
      transform: translateZ(calc(2px - var(--elevation-step) - 10px));
    }
  }
}

.project-name {
  font-size: 15px;
  font-weight: 600;
  line-height: 1.3;
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
