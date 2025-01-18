<template>
  <div class="header-container">
    <div class="user">
      <img class="avatar" :src="user.avatarUrl" alt="Avatar" />
      <div class="user-info">
        <div class="username">{{ user.username }}</div>
        <div class="level">Level {{ user.level }}</div>
      </div>
      <div class="resources">
        <div class="resource">
          <img class="icon" src="/src/assets/icons/coins.png" alt="Coins" />
          <span>{{ user.coins }}</span>
        </div>
        <div class="resource">
          <img class="icon" src="/src/assets/icons/gems.png" alt="Gems" />
          <span>{{ user.gems }}</span>
        </div>
      </div>
    </div>
    <div class="buttons" @click="toggleFullScreen">
      <div class="fullScreen" v-show="!isFullScreen">
        <svg width="25" height="25" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <path d="M32 0h-13l5 5-6 6 3 3 6-6 5 5z"></path>
          <path d="M32 32v-13l-5 5-6-6-3 3 6 6-5 5z"></path>
          <path d="M0 32h13l-5-5 6-6-3-3-6 6-5-5z"></path>
          <path d="M0 0v13l5-5 6 6 3-3-6-6 5-5z"></path>
        </svg>
      </div>
      <div class="fullScreen" v-show="isFullScreen">
        <svg width="25" height="25" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 14h13l-5-5 6-6-3-3-6 6-5-5z"></path>
          <path d="M18 18v13l5-5 6 6 3-3-6-6 5-5z"></path>
          <path d="M14 18h-13l5 5-6 6 3 3 6-6 5 5z"></path>
          <path d="M14 14v-13l-5 5-6-6-3 3 6 6-5 5z"></path>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import { ref } from "vue";

let isFullScreen = ref(false);

defineProps({
  user: {
    type: Object,
    required: true,
    default: () => ({}),
    validator: (user) => {
      return ["coins", "gems", "level", "username", "avatarUrl"].every((key) =>
        user.hasOwnProperty(key)
      );
    },
  },
});

const toggleFullScreen = () => {
console.log(isFullScreen.value);
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    isFullScreen.value = true;
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
      isFullScreen.value = false;
    }
  }
};
</script>

<style scoped>
.header-container {
  border-radius: 0;
  position: fixed;
  top: 0;
  padding: 10px 3vw;
  font-size: small;
  height: 30px;
  background-color: white;
  width: 100%;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user {
  display: flex;
  align-items: center;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.user-info {
  flex-grow: 1;
  padding-left: 10px;
}

.username {
  white-space: nowrap;
  text-align: center;
}

.level {
  color: #777;
  white-space: nowrap;
}

.resources {
  display: flex;
  align-items: center;
}

.resource {
  display: flex;
  align-items: center;
  margin-left: 10px;
}

.icon {
  width: 20px;
  height: 20px;
  margin-right: 5px;
  margin-left: 5px;
}

.buttons {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding-right: 8vw;
}
</style>
