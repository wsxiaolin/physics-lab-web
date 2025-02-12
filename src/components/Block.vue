<template>
  <div class="outer">
    <div class="head">
      <div id="title">{{ title }}</div>
      <div id="more">更多</div>
    </div>
    <Detailed v-for="(item, index) in data" :key="index" :data="item" :type="type" />
  </div>
</template>

<script setup>
import Detailed from "../components/projects/detailed.vue";
defineProps({
  data: Array,
  title: String,
  type: String
});
</script>

<style scoped>
.outer {
  border-radius: 8px;
  background-color: white;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
  padding: 10px;
}

.head {
  display: flex;
}

.head {
  font-size: 15px;
  color: #007bff;
  width: 100%;
  padding: 8px;
}

#title {
  align-self: flex-start;
  font-weight: bold;
}

#more {
  align-self: flex-end;
  margin-left: auto;
  margin-right: 20px;
}
</style>
