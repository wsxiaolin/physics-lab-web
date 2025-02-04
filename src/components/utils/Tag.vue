<template>
  <div class="tag" v-if="!tag.startsWith('Type-')" v-text="tag === '交流' ? '综合交流' : tag" :href="targetLink"></div>
</template>

<script setup>
defineProps({
  tag: String,
  targetLink: String,
});
</script>

<style scoped>
.tag {
  display: inline-block;
  padding: 2px;
  border-radius: 3px;
  background-color: rgba(240, 240, 240, 0.8);
  color: #333;
  font-size: 9px;
  margin: 0 10px 0 0;
}
</style>
