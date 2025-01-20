<template>
  <div class="tag" v-if="tag!='Type-0'" v-text="tag" :href="targetLink"></div>
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
  border-radius: 5px;
  background-color: rgba(240, 240, 240, 0.8);
  color: #333;
  font-size: 9px;
  margin: 5px 10px 0 0;
}
</style>
