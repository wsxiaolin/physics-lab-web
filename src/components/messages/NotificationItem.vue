<template>
  <div id="notification_container">
    <div class="img"><img :src="avatar_url" id="avatar" /></div>
    <div id="notification" class="notification">
      <div id="notification_title" class="notification_title">
        {{ msg_title }}
      </div>
      <div id="notification_message" class="notification_message">
        <div id="notification_icon" class="notification_icon">
          <img :src="msg_icon_url" id="notification_icon" />
        </div>
        <div id="notification_text" class="notification_text">
          {{ msg }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

// 解构传递的props
const props = defineProps({
  avatar_url: String,
  msg: String,
  msg_title: String,
  msg_type: Number, // 0: System, 1: Comments, 2: Followers, 3: Projects, 4: Admin
});

// 计算消息图标路径

const msg_icon_url = computed(() => {
  switch (props.msg_type) {
    case 0:
      return "src/assets/icons/notifications_system.png"; // 直接返回静态路径
    case 1:
      return "src/assets/icons/notifications_comments.png";
    case 2:
      return "src/assets/icons/notifications_followers.png";
    case 3:
      return "src/assets/icons/notifications_projects.png";
    case 4:
      return "src/assets/icons/notifications_admin.png";
    default:
      return "";
  }
});
</script>

<style scoped>
#notification_container {
  height: 70px;
  padding: 10px;
  display: flex;
  flex-direction: row;
  gap: 10px;
}

#notification_container:hover {
  background-color: #f0f0f0;
}

#avatar {
  height: 70px;
  width: 70px;
  border-radius: 50%;
}

#avatar::after {
  content: "";
  mix-blend-mode: luminosity;
}

#notification {
  width: 100%;
  height: 100px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

#notification_icon {
  width: 20px;
  height: 20px;
  top: 2px;
  background-color: transparent;
  display: flex;
}

#notification_title {
  font-size: 18px;
  margin-right: auto;
  font-weight: bold;
}

#notification_message {
  width: 100%;
  height: 40px;
  display: flex;
  flex-direction: row;
  gap: 5px;
}

#notification_text {
  font-size: 15px;
  overflow: hidden;
  text-align: left;
  height: 2.8em;
  /* 防止显示多行 */
}

#icon {
  height: 16px;
  width: 16px;
}

#notification_container:hover {
  background-color: #f0f0f0;
}
</style>
