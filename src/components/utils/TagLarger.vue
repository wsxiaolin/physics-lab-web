<template>
  <div
    class="tag"
    v-if="!tag.startsWith('Type-')"
    v-text="tag === '交流' ? '综合交流' : tag"
    :href="targetLink"
  ></div>
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
  padding: 2px 10px;
  border-radius: 5px;
  background-color: hsla(0, 6%, 7%, 0.559);
  color: white;
  font-size: 12px;
  margin: 0 3px;
}
</style>
