<template>
  <div class="front-content">
    <UiCard class="profile-card">
      <UiText>
        <div class="profile-header">
          <h1 class="name">
            ixplo
          </h1>
          <div class="role">
            Frontend Developer
          </div>
        </div>

        <div class="profile-content">
          <div class="description">
            <div>Creative portfolio with</div>
            <div class="highlight">open source code</div>
          </div>
        </div>
      </UiText>

      <div class="profile-footer">
        <div class="tech-stack">
          <UiBadge>Vue/Nuxt</UiBadge>
          <UiBadge>React/Next</UiBadge>
          <UiBadge>TypeScript</UiBadge>
        </div>
      </div>
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

.profile-header {
  text-align: center;
}

.name {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  line-height: 1.2;
}

.role {
  margin: 8px 0 0;
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.profile-content {
  margin: 16px 0 0;
  text-align: center;
}

.description {
  margin: 0;
  color: #fff;
  font-size: 15px;
  line-height: 1.5;
}

.highlight {
  color: #fc0;
  font-weight: 600;
}

.profile-footer {
  margin-top: 16px;
  transform-style: preserve-3d;
}

.tech-stack {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  transform-style: preserve-3d;
}

.profile-actions {
  display: flex;
  justify-content: center;
  margin-top: 24px;
  transform-style: preserve-3d;
}
</style>
