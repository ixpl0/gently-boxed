<template>
  <div class="front-content">
    <UiCard class="profile-card">
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
}

.profile-card {
  width: 300px;
}

.profile-header {
  text-align: center;
}

.name {
  margin: 0;
  font-size: 28px;
  font-weight: bold;
}

.role {
  margin: 4px 0 0;
  color: #ccc;
  font-size: 18px;
}

.profile-content {
  margin: 20px 0;
  text-align: center;
}

.description {
  margin: 0;
  color: #ddd;
  font-size: 16px;
}

.highlight {
  color: #fc0;
  font-weight: bold;
}

.profile-footer {
  margin-top: 10px;
}

.tech-stack {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.profile-actions {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}
</style>
