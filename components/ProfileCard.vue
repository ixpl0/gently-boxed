<template>
  <div class="front-content">
    <UiCard class="profile-card">
      <UiText>
        <h1 class="name">
          ixplo
        </h1>
      </UiText>

      <div class="specializations">
        <UiBadge>AI Harness Architect</UiBadge>
        <UiBadge>Frontend Developer</UiBadge>
        <UiBadge>Team Leader</UiBadge>
      </div>

      <UiText>
        <div class="description">
          <div>Creative portfolio with</div>
          <div class="highlight">open source code</div>
        </div>
      </UiText>
    </UiCard>

    <div class="profile-actions">
      <UiButton>
        Contacts
      </UiButton>
    </div>
  </div>
</template>

<style scoped>
.front-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  transform-style: preserve-3d;
}

.profile-card {
  width: 320px;
}

.name {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  line-height: 1.2;
  text-align: center;
}

.specializations {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-top: 12px;
  transform-style: preserve-3d;
}

.description {
  margin: 16px 0 0;
  color: #fff;
  font-size: 15px;
  line-height: 1.5;
  text-align: center;
}

.highlight {
  color: #fc0;
  font-weight: 600;
}

.profile-actions {
  display: flex;
  justify-content: center;
  margin-top: 24px;
  transform-style: preserve-3d;
}
</style>
