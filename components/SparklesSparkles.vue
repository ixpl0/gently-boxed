<template>
  <div class="sparkles-sparkles">
    <div v-for="i in 12" :key="i" class="sparkle" />
  </div>
</template>

<style scoped>
.sparkles-sparkles {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.sparkle {
  --duration: 2s;
  --horizontal-size: 9px;
  --vertical-size: 11px;
  --line-thickness: 1px;
  position: absolute;
  opacity: 0;
  transform: translate(-50%, -50%) scale(0);
  animation: sparkle var(--duration) infinite;
}

.sparkle:nth-child(1) {
  top: 10%;
  left: 20%;
  animation-delay: calc(var(--duration) * 0 / 12);
}

.sparkle:nth-child(2) {
  top: 20%;
  left: 70%;
  animation-delay: calc(var(--duration) * 1 / 12);
}

.sparkle:nth-child(3) {
  top: 70%;
  left: 10%;
  animation-delay: calc(var(--duration) * 2 / 12);
}

.sparkle:nth-child(4) {
  top: 80%;
  left: 80%;
  animation-delay: calc(var(--duration) * 3 / 12);
}

.sparkle:nth-child(5) {
  top: 50%;
  left: 5%;
  animation-delay: calc(var(--duration) * 4 / 12);
}

.sparkle:nth-child(6) {
  top: 40%;
  left: 90%;
  animation-delay: calc(var(--duration) * 5 / 12);
}

.sparkle:nth-child(7) {
  top: 90%;
  left: 30%;
  animation-delay: calc(var(--duration) * 6 / 12);
}

.sparkle:nth-child(8) {
  top: 70%;
  left: 60%;
  animation-delay: calc(var(--duration) * 7 / 12);
}

.sparkle:nth-child(9) {
  top: 30%;
  left: 95%;
  animation-delay: calc(var(--duration) * 8 / 12);
}

.sparkle:nth-child(10) {
  top: 30%;
  left: 40%;
  animation-delay: calc(var(--duration) * 9 / 12);
}

.sparkle:nth-child(11) {
  top: 10%;
  left: 50%;
  animation-delay: calc(var(--duration) * 10 / 12);
}

.sparkle:nth-child(12) {
  top: 55%;
  left: 45%;
  animation-delay: calc(var(--duration) * 11 / 12);
}

.sparkle::before,
.sparkle::after {
  position: absolute;
  border: 0 solid #fff;
  box-shadow: 0 0 4px #fff, 0 0 8px #ffffff4c;
  content: "";
}

.sparkle::before {
  top: 0;
  left: calc((var(--horizontal-size) - var(--line-thickness)) / -2);
  width: var(--horizontal-size);
  height: 0;
  border-top-width: var(--line-thickness);
}

.sparkle::after {
  top: calc((var(--vertical-size) - var(--line-thickness)) / -2);
  left: 0;
  width: 0;
  height: var(--vertical-size);
  border-left-width: var(--line-thickness);
}

@keyframes sparkle {
  0%,
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0);
  }

  33% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}
</style>
