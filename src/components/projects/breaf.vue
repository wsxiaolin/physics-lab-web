<template>
  <div class="card" :type="type">
    <img :src="imgUrl" class="icon" />
    <div class="text">
      <p class="title">{{ data.title }}</p>
      <p class="subtitle">{{ data.author + "&nbsp;&nbsp;-" + data.date }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const { data, type } = defineProps({
  data: Object,
  type: String,
});

const imgUrl = computed(
  () =>
    `/static/experiments/images/${data.id.slice(0, 4)}/${data.id.slice(4, 6)}/${data.id.slice(
      6,
      8
    )}/${data.id.slice(8, 24)}/0.jpg!block`
);
</script>

<style scoped>
.card {
  display: flex;
  align-items: center;
  background-color: #f0f0f0;
  padding: 10px;
  height: 30px;
  background-color: rgba(0, 0, 0, 0.05);
}

.icon {
  width: 30px;
  height: 30px;
  border-radius: 5px;
  margin-right: 10px;
}

.text {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.title {
  font-size: 12px;
  color: white;
  margin: 0;
}

.subtitle {
  font-size: 12px;
  color: white;
  margin: 5px 0 0 0;
}
</style>
