<template>
  <div class="front-content">
    <div class="profile-card">
      <div class="profile-header">
        <h1 class="name">
          ixplo
        </h1>
        <p class="role">
          Frontend Developer
        </p>
      </div>

      <div class="profile-content">
        <p class="description">
          Creative portfolio with<br />
          <span class="highlight">open source code</span>
        </p>
      </div>

      <div class="profile-footer">
        <div class="tech-stack">
          <span class="tech">Vue/Nuxt</span>
          <span class="tech">React/Next</span>
          <span class="tech">TypeScript</span>
        </div>
      </div>
    </div>

    <div class="profile-actions">
      <button class="portfolio-btn">
        Contacts
      </button>
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
  padding: 20px;
  background: rgb(255 255 255 / 10%);
  border-radius: 8px;
  box-shadow: 0 4px 8px rgb(0 0 0 / 20%);
  backdrop-filter: blur(10px);
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

.tech {
  margin: 0 8px;
  padding: 4px 8px;
  color: #fff;
  font-size: 14px;
  background: rgb(255 255 255 / 10%);
  border-radius: 4px;
}

.profile-actions {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

.portfolio-btn {
  margin-top: 10px;
  padding: 10px 20px;
  color: #fff;
  font-size: 16px;
  background: rgb(255 255 255 / 15%);
  border: 1px solid rgb(255 255 255 / 30%);
  border-radius: 4px;
  backdrop-filter: blur(8px);
  box-shadow: 0 2px 6px rgb(0 0 0 / 15%);
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    background: rgb(255 255 255 / 25%);
    border-color: rgb(255 255 255 / 50%);
    box-shadow: 0 4px 12px rgb(0 0 0 / 25%);
    transform: translateY(-1px);
  }
}
</style>
