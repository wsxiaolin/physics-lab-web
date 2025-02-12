<template>
  <Header>
    <h1>作品列表</h1>
  </Header>

  <div class="list">
    <WorksList :row="itemsPerRow"/>
  </div>
</template>

<script setup lang="ts">
import Header from "../components/utils/Header.vue";
import WorksList from "../components/projects/itemList.vue";
import { onMounted, onUnmounted, ref } from "vue";

const itemsPerRow = ref(getItemsPerRow());

function getItemsPerRow() {
  const width = window.innerWidth;
  switch (true) {
    case width >= 1200:
      return 5;
    case width >= 800:
      return 4;
    case width >= 500:
      return 3;
    default:
      return 2;
  }
}

const handleResize = () => {
  itemsPerRow.value = getItemsPerRow();
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped>
.list {
  margin-top: 60px;
  padding: 20px;
  width: 100dvw;
  box-sizing: border-box;
  min-height: 100dvh;
  background-color: #ccc3;
}
</style>
