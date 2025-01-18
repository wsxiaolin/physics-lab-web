<template>
  <div>
    <div class="container" :style="{ backgroundImage: `url(${ProjectsBackground})` }">
      <h2 class="title">{{projectsName}}</h2>
      <div class="box">
        <Works v-for="item in projects" :key="item.id" :data="item" :type="type"></Works>
      </div>
    </div>
    <div class="activity" :style="{ backgroundImage: `url(${activityBackground})` }">
      <h1 id="activity-text">{{ activityName }}</h1>
    </div>
  </div>
</template>

<script setup>
import Works from "./projects/breaf.vue";
import { computed } from "vue";
const { projects, type } = defineProps({
  projects: Array,
  type: String,
  activityName: String,
  activityBackground: String,
  projectsName: String,
});

const ProjectsBackground = computed(() => {
  const id = projects[0].id;
  return `/static/experiments/images/${id.slice(0, 4)}/${id.slice(4, 6)}/${id.slice(
    6,
    8
  )}/${id.slice(8, 24)}/0.jpg!block`;
});
</script>

<style scoped>
.activity {
  height: 75px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: left;
  margin-top: 20px;
  border-radius: 10px;
}

#activity-text {
  color: white;
  text-align: left;
  padding-left: 20px;
  font-weight: normal;
}

.container {
  border-radius: 8px;
  position: relative;
  color: #fff;
  height: 260px;
  display: flex;
  flex-direction: column;
}

.title {
  text-align: center;
  margin-bottom: 10px; /* 添加底边距使标题与 box 之间有些间距 */
  text-align: left;
  padding-left: 20px;
}

.box {
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: auto 0 0; /* 顶部 margin 设置为 auto 推动 box 到底部 */
}
</style>
