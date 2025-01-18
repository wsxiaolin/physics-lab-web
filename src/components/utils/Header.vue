<template>
  <div class="header-container">
    <slot></slot>
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
import { ref } from "vue";

let isFullScreen = ref(false);

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
  padding: 20px 3vw 10px 3vw;
  font-size: small;
  height: 30px;
  background-color: white;
  width: 100%;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.buttons {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding-right: 8vw;
}
</style>
