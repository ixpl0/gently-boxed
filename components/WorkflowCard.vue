<template>
  <div class="workflow-card">
    <h2 class="headline">
      <span class="headline-line" data-text="How I">How I</span>
      <span class="headline-line" data-text="work">work</span>
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
// paper, so the third principle takes the key plate instead; the cyan swatch
// borrows the page pool color so it stays tied to the scene's actual cyan)
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

/* Misregistered plates: the cyan and magenta passes are copies of the line laid
   over it, orbiting the key plate from opposite sides of the circle like a press
   whose registration keeps turning (the yellow pass is there too — invisible on
   the yellow paper by nature). They are real elements rather than a text-shadow
   pair because only transforms interpolate smoothly: an orbit built from shadow
   offsets has to step between keyframes, and the corners of that polygon read as
   a stutter at this slow pace. Each line runs a quarter turn apart */
.headline-line {
  --orbit-phase: 0s;
  position: relative;
  z-index: 0;
}

.headline-line:last-child {
  --orbit-phase: -1.6s;
}

.headline-line::before,
.headline-line::after {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  white-space: nowrap;
  animation: misprint-orbit 6.4s linear infinite;
  animation-delay: var(--orbit-phase);
  content: attr(data-text);
}

.headline-line::before {
  color: rgb(from var(--color-back-plate) r g b / 70%);
}

.headline-line::after {
  color: rgb(from var(--color-accent-back) r g b / 65%);
  animation-delay: calc(var(--orbit-phase) - 3.2s);
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
  --plate-color: var(--color-page-back);
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

/* One true circle: spin the copy around the line's center, push it out by the
   4px misregistration, then counter-spin it so the letters stay upright while
   their center travels the orbit */
@keyframes misprint-orbit {
  from {
    transform: rotate(0deg) translateX(4px) rotate(0deg);
  }

  to {
    transform: rotate(360deg) translateX(4px) rotate(-360deg);
  }
}
</style>
