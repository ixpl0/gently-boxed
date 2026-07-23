<template>
  <div class="workflow-card">
    <UiTitle>How I work</UiTitle>

    <div class="principles">
      <div
        v-for="principle in PRINCIPLES"
        :key="principle.title"
      >
        <div class="principle-title">
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
interface WorkflowPrinciple {
  title: string;
  summary: string;
}

// TODO: replace the placeholder copy with real workflow details
const PRINCIPLES: WorkflowPrinciple[] = [
  {
    title: 'Agent harnesses',
    summary: 'Multi-agent pipelines around real development workflows: orchestration, tool use, eval loops',
  },
  {
    title: 'AI-first delivery',
    summary: 'Spec → agents draft → human review → ship. Routine code is delegated, not typed',
  },
  {
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
  align-items: center;
  width: 400px;
  transform-style: preserve-3d;
}

.principles {
  display: flex;
  flex-direction: column;
  align-self: stretch;
  gap: 18px;
  margin-top: 28px;
}

.principle-title {
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.3;
}

.principle-summary {
  margin-top: 2px;
  color: #b4bdcf;
  font-size: 13px;
  line-height: 1.45;
}

/* Tools are bare text separated by wide gaps, echoing the roles row on the front face */
.tools {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px 24px;
  margin-top: 26px;
  color: #fff;
  font-size: 13px;
  font-weight: 500;
}
</style>
