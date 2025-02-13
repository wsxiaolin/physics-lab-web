<template>
  <div id="app" @click="handleClick">
    <n-message-provider>
      <Msg />
    </n-message-provider>

    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" v-if="$route.meta.keepAlive" :key="$route.fullPath" />
      </keep-alive>
      <component :is="Component" v-if="!$route.meta.keepAlive" :key="$route.fullPath" />
    </router-view>
  </div>
</template>

<script setup lang="ts">
import Msg from "./components/popup/msg.vue";
import getPath from "./services/getPath.ts";
import showUserCard from "./popup/usercard.ts"
window.$getPath = getPath;

const handleClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (target.classList.contains("RUser")) {
    showUserCard(target.dataset.user || "")
  }
};
</script>

<style>
body {
  margin: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100vw;
  background-color: white;
}

footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: #f8f9fa;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

footer a {
  color: #007bff;
  text-decoration: none;
}

footer a.router-link-exact-active {
  color: #42b983;
  font-weight: bold;
}
</style>./components/popup/notice.vue