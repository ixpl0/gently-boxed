<template>
  <div class="workflow-content">
    <UiCard class="workflow-card">
      <UiText>
        <h2 class="title">
          How I work
        </h2>
      </UiText>

      <div class="principles">
        <UiText
          v-for="principle in PRINCIPLES"
          :key="principle.title"
        >
          <div class="principle">
            <div class="principle-title">
              {{ principle.title }}
            </div>

            <div class="principle-summary">
              {{ principle.summary }}
            </div>
          </div>
        </UiText>
      </div>

      <div class="tools">
        <UiBadge
          v-for="tool in TOOLS"
          :key="tool"
        >
          {{ tool }}
        </UiBadge>
      </div>
    </UiCard>
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
.workflow-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  transform-style: preserve-3d;
}

.workflow-card {
  width: 400px;
}

.title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.2;
  text-align: center;
}

.principles {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 18px;
  transform-style: preserve-3d;
}

.principle-title {
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.3;
}

.principle-summary {
  margin-top: 2px;
  color: #fff;
  font-size: 13px;
  line-height: 1.45;
}

.tools {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-top: 18px;
  transform-style: preserve-3d;
}
</style>
