<template>
  <!-- 无限滚动组件 -->
  <n-infinite-scroll style="height: 240px" :distance="10" @load="handleLoad">
    <!-- 遍历显示每一条消息 -->
    <div
      v-for="(item, index) in items"
      :key="item.key"
      class="message"
      :class="{ reverse: index % 5 === 0 }"
    >
      <!-- 显示头像 -->
      <img class="avatar" :src="item.avatar" alt="" />
      <span> {{ item.message }} {{ index % 5 === 0 ? "?" : "" }}</span>
    </div>
    <div v-if="loading" class="text">加载中...</div>
    <div v-if="noMore" class="text">没有更多了 🤪</div>
  </n-infinite-scroll>
</template>

<script setup>
import { computed, defineComponent, ref } from "vue";

const loading = ref(false);

// 定义几个示例头像链接
const avatars = [
  "https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg",
  "https://avatars.githubusercontent.com/u/20943608?s=60&v=4",
  "https://avatars.githubusercontent.com/u/46394163?s=60&v=4",
  "https://avatars.githubusercontent.com/u/39197136?s=60&v=4",
  "https://avatars.githubusercontent.com/u/19239641?s=60&v=4",
];

// 定义几条示例消息
const messages = ["星期一", "星期二", "星期三", "星期四", "星期五"];

// 模拟数据生成函数，生成带有随机头像和消息的对象
const mock = (i) => ({
  key: `${i}`,
  value: i,
  avatar: avatars[i % avatars.length], // 随机选择头像
  message: messages[Math.floor(Math.random() * messages.length)], // 随机选择消息
});

// 初始化数据，生成10条模拟数据
const items = ref(Array.from({ length: 10 }, (_, i) => mock(i)));

// 计算属性，判断是否没有更多数据
const noMore = computed(() => items.value.length > 16);

// 处理加载更多的逻辑
const handleLoad = async () => {
  if (loading.value || noMore.value) return; // 如果正在加载或者没有更多数据，直接返回
  loading.value = true; // 设置为加载中状态
  await new Promise((resolve) => setTimeout(resolve, 1e3)); // 模拟延时1秒钟
  // 添加更多数据
  items.value.push(...[mock(items.value.length), mock(items.value.length + 1)]);
  loading.value = false; // 结束加载
};
</script>

<style scoped>
.message {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  padding: 10px;
}

.message:last-child {
  margin-bottom: 0;
}

.reverse {
  flex-direction: row-reverse;
}

.text {
  text-align: center;
}

.reverse .avatar {
  margin-left: 10px;
}

.avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  margin-right: 10px;
}
</style>
