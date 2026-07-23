<template>
  <div class="workflow-card">
    <h2 class="headline">
      <span class="headline-line">How I</span>
      <span class="headline-line">work</span>
    </h2>

    <div class="principles">
      <div
        v-for="principle in PRINCIPLES"
        :key="principle.title"
      >
        <div
          class="principle-title"
          :data-plate="principle.plate"
        >
          {{ principle.title }}
        </div>

        <div class="principle-summary">
          {{ principle.summary }}
        </div>
      </div>
    </div>

    <div class="tools">
      <span
        v-for="tool in TOOLS"
        :key="tool"
      >
        {{ tool }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
// Each principle is "printed" by one plate of the side's CMYK set; the swatch
// before its title carries the plate's ink (yellow would vanish on the yellow
// paper, so the third principle takes the key plate instead)
type PrintPlateType = 'cyan' | 'magenta' | 'key';

interface WorkflowPrinciple {
  plate: PrintPlateType;
  title: string;
  summary: string;
}

// TODO: replace the placeholder copy with real workflow details
const PRINCIPLES: WorkflowPrinciple[] = [
  {
    plate: 'cyan',
    title: 'Agent harnesses',
    summary: 'Multi-agent pipelines around real development workflows: orchestration, tool use, eval loops',
  },
  {
    plate: 'magenta',
    title: 'AI-first delivery',
    summary: 'Spec → agents draft → human review → ship. Routine code is delegated, not typed',
  },
  {
    plate: 'key',
    title: 'Engineering stays human',
    summary: 'Architecture, taste and responsibility are the parts that never get delegated',
  },
];

const TOOLS = ['Claude Code', 'MCP', 'Evals', 'TypeScript'];
</script>

<style scoped>
.workflow-card {
  display: flex;
  flex-direction: column;
  width: 400px;
  color: var(--side-ink);
}

.headline {
  display: flex;
  flex-direction: column;
  margin: 0;
  font-family: var(--font-signage);
  font-size: 54px;
  font-weight: 400;
  line-height: 1.02;
  text-transform: uppercase;
}

/* Misregistered plates: the cyan and magenta passes sit slightly off the key
   plate and slowly swim, like a press losing registration in the water (the
   yellow pass is there too — invisible on the yellow paper by nature) */
.headline-line {
  animation: misprint-swim 8s ease-in-out infinite alternate;
}

.headline-line:last-child {
  animation-delay: -4s;
}

.principles {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-top: 34px;
}

.principle-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-grotesk);
  font-size: 13px;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

/* The plate swatch: a square of the ink this principle is printed with */
.principle-title::before {
  width: 8px;
  height: 8px;
  background: var(--plate-color);
  content: "";
}

.principle-title[data-plate="cyan"] {
  --plate-color: var(--color-back-plate);
}

.principle-title[data-plate="magenta"] {
  --plate-color: var(--color-accent-back);
}

.principle-title[data-plate="key"] {
  --plate-color: var(--side-ink);
}

.principle-summary {
  margin-top: 4px;
  padding-left: 18px;
  color: rgb(from var(--side-ink) r g b / 76%);
  font-family: var(--font-grotesk);
  font-size: 13px;
  line-height: 1.5;
}

/* The sheet's imprint line: tools as tracked-out bare caps along the bottom */
.tools {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 22px;
  margin-top: 32px;
  font-family: var(--font-grotesk);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  opacity: 0.6;
}

@keyframes misprint-swim {
  0% {
    text-shadow: 3px 2px 0 rgb(from var(--color-back-plate) r g b / 70%), -3px -1px 0 rgb(from var(--color-accent-back) r g b / 65%);
  }

  100% {
    text-shadow: 2px 3px 0 rgb(from var(--color-back-plate) r g b / 70%), -2px -3px 0 rgb(from var(--color-accent-back) r g b / 65%);
  }
}
</style>
