<template>
  <!-- 无限滚动组件 -->
  <n-infinite-scroll id="list" :distance="10" @load="handleLoad">
    <!-- 遍历显示每一条消息 -->
    <div v-for="item in items" :key="item.id">
      <Notification
        :avatar_url="item.avatar_url"
        :msg_title="item.msg_title"
        :msg="item.msg"
        :msg_type="item.msg_type"
      ></Notification>
      <n-divider style="margin: 8px" />
    </div>
    <div v-if="loading" class="text">加载中...</div>
  </n-infinite-scroll>
</template>

<script setup>
import { ref } from "vue";
import Notification from "../components/messages/NotificationItem.vue";
import { getData } from "../services/getData";

const items = ref([]);
const loading = ref(false);
let skip = 0;
let templates = {};

async function getavatarUrl(ID) {
  let avatarIndex = 0;
  const cache = JSON.parse(localStorage.getItem("userIDAndAvartarIDMap")) || {};
  // 四小时缓存
  if (
    cache[ID] &&
    Math.abs(Date.now() - cache[ID][1]) < 4 * 60 * 60 * 1000 &&
    cache[ID][0] !== undefined &&
    cache[ID][0] !== null
  ) {
    avatarIndex = cache[ID][0];
  } else {
    try {
      const re = await getData("/Users/GetUser", { ID });
      avatarIndex = re.Data.User.Avatar;
      cache[ID] = [avatarIndex, Date.now()];
      localStorage.setItem("userIDAndAvartarIDMap", JSON.stringify(cache));
    } catch (error) {
      console.error("获取头像失败", error);
    }
  }
  return avatarIndex === 0
    ? "/src/assets/user/default-avatar.png"
    : `/static/users/avatars/${ID.slice(0, 4)}/${ID.slice(4, 6)}/${ID.slice(6, 8)}/${ID.slice(
        8,
        24
      )}/${avatarIndex}.jpg!small.round`;
}

function convertCategoryID(n) {
  // 紫兰斋的编号与UI不一致
  return n === 2 ? 2 : n === 3 ? 1 : n - 1;
}

function fillInTemplate(data, message) {
  // 等待实现的actions:showComment Confirm<不打算实现>
  return (
    data
      .replace(/{Users}/g, message.UserNames.join(" "))
      .replace(/{Experiment}/g, message.Fields?.Discussion || message.Fields?.Experiment)
      .replace(/{\$Content}/g, message.Fields.Content)
      .replace(/{\$TargetName}/g, localStorage.getItem("userName")) // 先放一放，后面补上
      .replace(/{\$Until}/g, message.Fields.Unitl)
      .replace(/{\$Editor}/g, message.Fields.Editor)
      .replace(/{\$Gold}/g, message.Numbers?.Gold)
      .replace(/undefined/g, "")
  );
}

async function renderTemplateWithData(messages) {
  const avatarPromises = messages.map((message) => getavatarUrl(message.Users[0]));
  const avatarUrls = await Promise.all(avatarPromises);

  return messages.map((message, index) => {
    const template = templates.find((t) => t.ID === message.TemplateID);
    return {
      id: message.ID,
      avatar_url: avatarUrls[index],
      msg_title: fillInTemplate(template.Subject.Chinese, message),
      msg: fillInTemplate(template.Content.Chinese, message),
      msg_type: convertCategoryID(message.CategoryID),
    };
  });
}

// 处理加载事件
const handleLoad = async (noTemplates = true) => {
  console.assert(localStorage.getItem("loginStatus") == "true", "未登录！");
  if (loading.value) return;
  loading.value = true;
  try {
    const GetMessagesResponse = await getData("/Messages/GetMessages", {
      CategoryID: 0,
      Take: 20,
      Skip: skip,
      NoTemplates: noTemplates,
    });

    if (!noTemplates) {
      templates = GetMessagesResponse.Data.Templates;
    }

    const messages = GetMessagesResponse.Data.Messages;
    console.log(messages);

    // 先设置默认头像
    const defaultItems = messages.map((message) => {
      const template = templates.find((t) => t.ID === message.TemplateID);
      return {
        id: message.ID,
        avatar_url: "/src/assets/user/default-avatar.png", // 设置默认头像
        msg_title: fillInTemplate(template.Subject.Chinese, message),
        msg: fillInTemplate(template.Content.Chinese, message),
        msg_type: convertCategoryID(message.CategoryID),
      };
    }); 

    items.value = [...items.value, ...defaultItems];

    // 并发请求新的头像地址
    const newItems = await renderTemplateWithData(messages);
    items.value = items.value.map((item) => {
      const newItem = newItems.find((ni) => ni.id === item.id);
      return newItem ? { ...item, avatar_url: newItem.avatar_url } : item;
    });

    skip += 20;
  } catch (error) {
    console.error("加载消息失败", error);
  } finally {
    loading.value = false;
  }
};

// 初始加载数据
handleLoad(false);
</script>

<style scoped>
.text {
  text-align: center;
  padding: 10px;
  color: #888;
}

#list {
  height: 100vh;
}
</style>
