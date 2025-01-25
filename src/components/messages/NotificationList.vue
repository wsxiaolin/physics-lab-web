<template>
  <div class="list">
    <!-- 无限滚动组件 -->
    <n-infinite-scroll :distance="10" @load="handleLoad">
      <!-- 遍历显示每一条消息 -->
      <div v-for="item in items" :key="item.id">
        <Notification
          :avatar_url="item.avatar_url"
          :msg_title="item.msg_title"
          :msg="item.msg"
          :msg_type="item.msg_type"
        ></Notification>
        <n-divider style="margin: 0" />
      </div>
      <div v-if="loading" class="text">加载中...</div>
    </n-infinite-scroll>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Notification from "./NotificationItem.vue";
import { getData } from "../../services/getData";
import { getAvatarUrl } from "../../services/getUserCurentAvatarByID";

const items = ref([]);
const loading = ref(false); // 用于无限滚动组件判断是否可以获取下一组数据
let skip = 0;
let templates = {};

const { notificationTypeIndexOfUI } = defineProps(["notificationTypeIndexOfUI"]);

/**
 * 紫兰斋的编号与UI不一致
 */
function convertCategoryIDToUIIndex(n) {
  return n === 2 ? 3 : n === 3 ? 2 : n;
}

function convertUIIndexToCategoryID(n) {
  return n === 3 ? 2 : n === 2 ? 3 : n;
}

/**
 * 由模板和数据渲染通知
 */
function fillInTemplate(data, message) {
  // 等待实现的actions:showComment
  return data
    .replace(/{Users}/g, message.UserNames.join(" "))
    .replace(/{Experiment}/g, message.Fields?.Discussion || message.Fields?.Experiment)
    .replace(/{\$Content}/g, message.Fields.Content)
    .replace(/{\$TargetName}/g, localStorage.getItem("nickName") || "朋友")
    .replace(/{\$Until}/g, message.Fields.Unitl)
    .replace(/{\$Editor}/g, message.Fields.Editor)
    .replace(/{\$Gold}/g, message.Numbers?.Gold)
    .replace(/undefined/g, "");
}

async function renderTemplateWithData(messages) {
  const avatarPromises = messages.map((message) => getAvatarUrl(message.Users[0], true));
  const avatarUrls = await Promise.all(avatarPromises);

  return messages.map((message, index) => {
    const template = templates.find((t) => t.ID === message.TemplateID);
    return {
      id: message.ID,
      avatar_url:
        convertCategoryIDToUIIndex(message.CategoryID) == 1
          ? "/src/assets/messages/Message-Unread.png"
          : avatarUrls[index],
      // 因为有缓存的原因，即使多一个请求也不是什么大问题（编辑的头像在社区活动出现频率蛮高的）所以暂时不改
      // 暂时不管读不读了，也没人在意
      msg_title: fillInTemplate(template.Subject.Chinese, message),
      msg: fillInTemplate(template.Content.Chinese, message),
      msg_type: convertCategoryIDToUIIndex(message.CategoryID),
    };
  });
}

// 处理加载事件
const handleLoad = async (noTemplates = true) => {
  console.assert(localStorage.getItem("token"), "未登录！");
  if (loading.value) return;
  loading.value = true;
  window.$message.loading("加载中...", { duration: 1e3 });
  try {
    const getMessagesResponse = await getData("/Messages/GetMessages", {
      CategoryID: convertUIIndexToCategoryID(notificationTypeIndexOfUI),
      Take: 20,
      Skip: skip,
      NoTemplates: noTemplates,
    });

    if (!noTemplates) {
      templates = getMessagesResponse.Data.Templates;
    }

    const messages = getMessagesResponse.Data.Messages;

    // 先设置默认头像
    const defaultItems = messages.map((message) => {
      const template = templates.find((t) => t.ID === message.TemplateID);
      return {
        id: message.ID,
        avatar_url: "/src/assets/user/default-avatar.png", // 设置默认头像
        msg_title: fillInTemplate(template.Subject.Chinese, message),
        msg: fillInTemplate(template.Content.Chinese, message),
        msg_type: convertCategoryIDToUIIndex(message.CategoryID),
      };
    });

    items.value = [...items.value, ...defaultItems];

    loading.value = false; // 我认为完全可以允许在本次头像渲染未完成的情况下渲染下一次

    // 并发请求新的头像地址
    const newItems = await renderTemplateWithData(messages);
    items.value = items.value.map((item) => {
      const newItem = newItems.find((ni) => ni.id === item.id);
      return newItem ? { ...item, avatar_url: newItem.avatar_url } : item;
    });

    skip += 20;
  } catch (error) {
    console.error("加载消息失败", error);
  }
};

// 初始加载数据
handleLoad(false);
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
