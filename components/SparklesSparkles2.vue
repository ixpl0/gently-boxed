<template>
  <div class="sparkles-sparkles">
    <div v-for="i in 12" :key="i" class="sparkle">
      <svg
        viewBox="0 0 122.88 122.88"
        class="sparkle-icon"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M62.43,122.88h-1.98c0-16.15-6.04-30.27-18.11-42.34C30.27,68.47,16.16,62.43,0,62.43v-1.98 c16.16,0,30.27-6.04,42.34-18.14C54.41,30.21,60.45,16.1,60.45,0h1.98c0,16.15,6.04,30.27,18.11,42.34 c12.07,12.07,26.18,18.11,42.34,18.11v1.98c-16.15,0-30.27,6.04-42.34,18.11C68.47,92.61,62.43,106.72,62.43,122.88L62.43,122.88z"
          fill="currentColor"
        />
      </svg>
    </div>
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
  position: absolute;
  width: 16px;
  height: 16px;
  color: #fff;
  animation: sparkle var(--duration) infinite;

  .sparkle-icon {
    display: block;
    width: 100%;
    height: 100%;
    filter: drop-shadow(0 0 4px #fff) drop-shadow(0 0 8px #ffffff4c);
  }

  &:nth-child(1) {
    top: 10%;
    left: 20%;
    animation-delay: calc(var(--duration) * 0 / 12);
  }

  &:nth-child(2) {
    top: 20%;
    left: 70%;
    animation-delay: calc(var(--duration) * 1 / 12);
  }

  &:nth-child(3) {
    top: 70%;
    left: 10%;
    animation-delay: calc(var(--duration) * 2 / 12);
  }

  &:nth-child(4) {
    top: 80%;
    left: 80%;
    animation-delay: calc(var(--duration) * 3 / 12);
  }

  &:nth-child(5) {
    top: 50%;
    left: 5%;
    animation-delay: calc(var(--duration) * 4 / 12);
  }

  &:nth-child(6) {
    top: 40%;
    left: 90%;
    animation-delay: calc(var(--duration) * 5 / 12);
  }

  &:nth-child(7) {
    top: 90%;
    left: 30%;
    animation-delay: calc(var(--duration) * 6 / 12);
  }

  &:nth-child(8) {
    top: 70%;
    left: 60%;
    animation-delay: calc(var(--duration) * 7 / 12);
  }

  &:nth-child(9) {
    top: 30%;
    left: 95%;
    animation-delay: calc(var(--duration) * 8 / 12);
  }

  &:nth-child(10) {
    top: 30%;
    left: 40%;
    animation-delay: calc(var(--duration) * 9 / 12);
  }

  &:nth-child(11) {
    top: 10%;
    left: 50%;
    animation-delay: calc(var(--duration) * 10 / 12);
  }

  &:nth-child(12) {
    top: 55%;
    left: 45%;
    animation-delay: calc(var(--duration) * 11 / 12);
  }
}

@keyframes sparkle {
  0%,
  100% {
    opacity: 0;
    transform: scale(0);
  }

  33% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
