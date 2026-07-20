<template>
  <div class="main-page">
    <TheCube v-model:side="side">
      <template #front>
        <ProfileCard />
      </template>
    </TheCube>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { SideType } from '~/utils/sides';
import { getRoutePathFromSide, getSideFromRouteParam } from '~/utils/sides';

definePageMeta({
  // Nuxt would otherwise remount the page on every param change, killing the spin transition
  key: 'cube-page',
  validate: (route) => {
    const param = route.params['side'];

    if (param === undefined || param === '') {
      return true;
    }

    return typeof param === 'string' && /^[1-6]$/.test(param);
  },
});

const route = useRoute();
const router = useRouter();

// The URL is the source of truth: spins push /1../6, browser back/forward replay them
const side = computed<SideType>({
  get: () => getSideFromRouteParam(route.params['side']),
  set: (nextSide) => {
    void router.push(getRoutePathFromSide(nextSide));
  },
});
</script>

<style scoped>
.main-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  min-height: 100dvh;
  background: #0a0a0a;
}
</style>
