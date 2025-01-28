<template>
  <div class="list">
    <!-- 无限滚动组件 -->
    <n-infinite-scroll :distance="10" @load="handleLoad">
      <!-- 遍历显示每一条消息 -->
      <div v-for="item in items" :key="item.id">
        <MessageItem
          :avatar_url="item.avatar_url"
          :msg_title="item.msg_title"
          :msg="item.msg"
          :msg_type="item.msg_type"
        ></MessageItem>
        <n-divider style="margin: 0" />
      </div>
      <div v-if="loading && !noMore" class="text">加载中...</div>
      <div v-if="noMore" class="text">我是有底线滴</div>
    </n-infinite-scroll>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import MessageItem from "./MessageItem.vue";
import { getData } from "../../services/getData";
import type { PropType } from "vue";

const { ID, Category } = defineProps({
  ID: String,
  Category: {
    type: String as PropType<"Discussion" | "Experiment">,
    required: true,
  },
});

const items: any = ref([]);
const loading = ref(false); // 用于无限滚动组件判断是否可以获取下一组数据
let noMore = ref(false); // 用于无限滚动组件判断是否已经没有更多数据了
let skip = 0;
let from: any = null;

// 处理加载事件
const handleLoad = async () => {
  if (loading.value) return;
  loading.value = true;
  window.$message.loading("加载中...", { duration: 1e3 });
  try {
    const getMessagesResponse = await getData("Messages/GetComments", {
      TargetID: ID,
      TargetType: Category,
      CommentID: from,
      Take: 20,
      Skip: skip,
    });

    const messages = getMessagesResponse.Data.Comments;
    // 第一条重复的，不要
    !from || messages.shift();
    console.log(messages);
    from = messages[messages.length - 1].ID;

    const defaultItems = messages.map((message: any) => {
      return {
        id: message.ID,
        avatar_url: computed(() => {
          if (message.Avatar === 0) return "/src/assets/user/default-avatar.png"; //默认头像
          return `/static/users/avatars/${message.UserID.slice(0, 4)}/${message.UserID.slice(
            4,
            6
          )}/${message.UserID.slice(6, 8)}/${message.UserID.slice(8, 24)}/${
            message.Avatar
          }.jpg!small.round`;
        }).value,
        msg_title: message.Nickname,
        msg: message.Content,
      };
    });

    items.value = [...items.value, ...defaultItems];
    loading.value = false;
    skip += 20;
    // 消息长度不足19说明加载完成，使nativeui不再加载
    if (messages.length < 19) {
      noMore.value = true; 
    }
  } catch (error) {
    console.error("加载消息失败", error);
  }
};

// 初始加载数据
handleLoad();
</script>

<style scoped>
.text {
  text-align: center;
  /* padding: 10px; */
  color: #888;
}

.list {
  height: 100%;
  padding-bottom: 60px;
}
</style>
